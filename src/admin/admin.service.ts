import { Inject, Injectable } from '@nestjs/common';
import type { DrizzleDB } from '../drizzle/types';
import { providerProfiles, users, bookings, services } from '../drizzle/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { UpdateProviderStatusDto } from './dto/update-status.dto';

@Injectable()
export class AdminService {
    constructor(@Inject('DRIZZLE') private db: DrizzleDB) { }

    async getPendingApplications() {
        // Fetch profiles with status 'Pending' + user details
        const result = await this.db
            .select({
                id: providerProfiles.id,
                userId: providerProfiles.userId,
                businessName: providerProfiles.businessName,
                address: providerProfiles.address,
                experience: providerProfiles.experience,
                status: providerProfiles.status,
                user: {
                    name: users.name,
                    email: users.email,
                    phoneNumber: users.phoneNumber,
                },
            })
            .from(providerProfiles)
            .innerJoin(users, eq(providerProfiles.userId, users.id))
            .where(eq(providerProfiles.status, 'PENDING_APPROVAL'));

        return result;
    }

    async getDashboardStats() {
        // 1. Total Bookings
        const totalBookings = await this.db.select({ count: sql<number>`count(*)` }).from(bookings);

        // 2. Completed Bookings
        const completedBookings = await this.db
            .select({ count: sql<number>`count(*)` })
            .from(bookings)
            .where(eq(bookings.status, 'Completed'));

        // 3. Active Providers
        const activeProviders = await this.db
            .select({ count: sql<number>`count(*)` })
            .from(providerProfiles)
            .where(eq(providerProfiles.status, 'APPROVED'));

        // 4. Pending Applications
        const pendingApps = await this.db
            .select({ count: sql<number>`count(*)` })
            .from(providerProfiles)
            .where(eq(providerProfiles.status, 'PENDING_APPROVAL'));

        // 5. Total Revenue
        const revenue = await this.db
            .select({ total: sql<number>`sum(${services.price})` })
            .from(bookings)
            .innerJoin(services, eq(bookings.serviceId, services.id))
            .where(eq(bookings.status, 'Completed'));

        return {
            totalBookings: Number(totalBookings[0]?.count || 0),
            completedBookings: Number(completedBookings[0]?.count || 0),
            activeProviders: Number(activeProviders[0]?.count || 0),
            pendingApps: Number(pendingApps[0]?.count || 0),
            revenue: Number(revenue[0]?.total || 0),
        };
    }

    async getAllBookings() {
        return await this.db.query.bookings.findMany({
            orderBy: [desc(bookings.date)],
            with: {
                service: true,
                customer: true,
                provider: {
                    with: {
                        // profile: true // If needed
                    }
                }
            }
        });
    }

    async getAllProviders() {
        return await this.db.query.providerProfiles.findMany({
            with: {
                user: {
                    with: {
                        bookingsAsProvider: true
                    }
                }
            }
        });
    }

    async updateProviderStatus(profileId: string, dto: UpdateProviderStatusDto) {
        // Logic for 'Approved' -> isVerified = true exists.
        // Logic for 'Inactive' -> just status update.
        const isVerified = dto.status === 'APPROVED';

        return await this.db
            .update(providerProfiles)
            .set({
                status: dto.status,
                isVerified: isVerified, // Should we un-verify if Inactive? Probably not necessary, but safe to keep verified logic consistent
                rejectionReason: dto.rejectionReason,
            })
            .where(eq(providerProfiles.id, profileId))
            .returning();
    }
}
