import { Inject, Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import type { DrizzleDB } from '../drizzle/types';
import { bookings, providerProfiles, users, services } from '../drizzle/schema';
import { eq, and, gte, lt, sql, ne, notInArray, desc } from 'drizzle-orm';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
    private readonly logger = new Logger(BookingsService.name);

    constructor(@Inject('DRIZZLE') private db: DrizzleDB) { }

    async getProviderAvailability(providerId: string, date: string) {
        // Parse date to start of day and end of day
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Find all confirmed or pending or accepted or in_progress bookings for this provider on this date
        // Exclude Cancelled / Rejected
        const existingBookings = await this.db.query.bookings.findMany({
            where: and(
                eq(bookings.providerId, providerId),
                gte(bookings.date, startOfDay),
                lt(bookings.date, endOfDay),
                notInArray(bookings.status, ['Cancelled', 'Rejected'])
            ),
            columns: {
                date: true,
            },
        });

        // Extract just the times that are booked
        return existingBookings.map(b => b.date.toISOString());
    }

    async findAvailableProviders(categoryId: string, date: string, timeSlot?: string) {
        // 1. Get all providers in this category
        // 2. Filter out those who have a booking at the requested time (if provided)

        const bookingDate = new Date(date);
        if (timeSlot) {
            // Parse timeSlot logic roughly matching frontend
            // timeSlot ex: "09:00 AM"
            const [time, period] = timeSlot.split(' ');
            let [hours, mins] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            bookingDate.setHours(hours, mins, 0, 0);
        } else {
            bookingDate.setHours(0, 0, 0, 0);
        }

        // If filtering by specific slot:
        if (timeSlot) {
            // Find IDs of providers booked at this time (excluding Cancelled/Rejected)
            const bookedProviders = await this.db
                .select({ providerId: bookings.providerId })
                .from(bookings)
                .where(and(
                    eq(bookings.date, bookingDate),
                    notInArray(bookings.status, ['Cancelled', 'Rejected'])
                ));

            const bookedIds = bookedProviders.map(b => b.providerId).filter((id): id is string => !!id);

            // Find providers in category NOT in bookedIds
            const availableConditions: any[] = [
                eq(providerProfiles.categoryId, categoryId),
                eq(providerProfiles.status, 'APPROVED')
            ];

            if (bookedIds.length > 0) {
                availableConditions.push(notInArray(providerProfiles.userId, bookedIds));
            }

            return await this.db.select({
                id: providerProfiles.id,
                userId: providerProfiles.userId,
                businessName: providerProfiles.businessName,
                bio: providerProfiles.bio,
                rating: providerProfiles.rating,
                experience: providerProfiles.experience,
                address: providerProfiles.address
            })
                .from(providerProfiles)
                .where(and(...availableConditions));
        }

        // If no time slot, just return all providers for category
        return await this.db.query.providerProfiles.findMany({
            where: and(
                eq(providerProfiles.categoryId, categoryId),
                eq(providerProfiles.status, 'APPROVED')
            )
        });
    }

    async createBooking(dto: CreateBookingDto, customerId: string) {
        // Basic validation: Check if slot is already taken
        const bookingDate = new Date(dto.date);

        // Check for existing booking at the exact same time
        const existing = await this.db.query.bookings.findFirst({
            where: and(
                eq(bookings.providerId, dto.providerId),
                eq(bookings.date, bookingDate),
                notInArray(bookings.status, ['Cancelled', 'Rejected'])
            )
        });

        if (existing) {
            throw new Error('This time slot is no longer available.');
        }

        return await this.db.insert(bookings).values({
            providerId: dto.providerId,
            serviceId: dto.serviceId,
            customerId: customerId,
            date: bookingDate,
            customerName: dto.customerName,
            customerEmail: dto.customerEmail,
            customerPhone: dto.customerPhone,
            address: dto.address,
            status: 'Pending'
        } as any).returning();
    }

    async getProviderBookings(providerId: string) {
        return await this.db.query.bookings.findMany({
            where: eq(bookings.providerId, providerId),
            with: {
                service: true,
            },
            orderBy: [desc(bookings.date)]
        });
    }

    async getCustomerBookings(customerId: string) {
        return await this.db.query.bookings.findMany({
            where: eq(bookings.customerId, customerId),
            with: {
                service: true,
                provider: {
                    with: {
                        profile: true // Access profile via user -> profile relation if needed, or if provider relation points to Users, we need to go deeper
                    }
                }
            },
            orderBy: [desc(bookings.date)]
        });
    }

    async updateBookingStatus(bookingId: string, status: 'Accepted' | 'Rejected' | 'InProgress' | 'Completed' | 'Cancelled', providerId: string) {
        return await this.db.transaction(async (tx) => {
            // Check if booking exists and belongs to provider
            const booking = await tx.query.bookings.findFirst({
                where: and(
                    eq(bookings.id, bookingId),
                    eq(bookings.providerId, providerId)
                )
            });

            if (!booking) {
                throw new NotFoundException('Booking not found or access denied');
            }

            // Validate transitions (Simple state machine)
            const current = booking.status;

            // Rules:
            // Pending -> Accepted, Rejected
            // Accepted -> InProgress, Cancelled
            // InProgress -> Completed
            // Completed -> (Final)
            // Cancelled -> (Final)
            // Rejected -> (Final)

            let isValid = false;
            if (current === 'Pending' && (status === 'Accepted' || status === 'Rejected')) isValid = true;
            else if (current === 'Accepted' && (status === 'InProgress' || status === 'Cancelled')) isValid = true;
            else if (current === 'InProgress' && status === 'Completed') isValid = true;
            else if (current === status) isValid = true; // No-op

            if (!isValid) {
                throw new BadRequestException(`Cannot transition from ${current} to ${status}`);
            }

            const updated = await tx.update(bookings)
                .set({ status })
                .where(eq(bookings.id, bookingId))
                .returning();

            // Notification Logic
            if (status === 'Accepted') {
                await this.notifyCustomer(booking, `Your booking for ${booking.date} has been accepted!`);
            } else if (status === 'Rejected') {
                await this.notifyCustomer(booking, `Your booking for ${booking.date} was unavailable.`);
            }

            return updated;
        });
    }

    private async notifyCustomer(booking: any, message: string) {
        // Mock Notification Service
        // In real world: EmailService.send(booking.customerEmail, message)
        this.logger.log(`[NOTIFICATION] To: ${booking.customerEmail || 'Customer'} | Msg: ${message}`);
    }
}
