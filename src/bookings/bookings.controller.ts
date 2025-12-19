import { Controller, Get, Post, Patch, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming generic auth guard exists

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Get('availability')
    async checkAvailability(
        @Query('providerId') providerId: string,
        @Query('date') date: string,
    ) {
        return await this.bookingsService.getProviderAvailability(providerId, date);
    }

    @Get('available-providers')
    async getAvailableProviders(
        @Query('categoryId') categoryId: string,
        @Query('date') date: string,
        @Query('timeSlot') timeSlot?: string
    ) {
        return await this.bookingsService.findAvailableProviders(categoryId, date, timeSlot);
    }

    @Post()
    // @UseGuards(JwtAuthGuard) // TODO: Enable auth
    async createBooking(@Body() dto: CreateBookingDto, @Request() req) {
        // For now, since we haven't set up full auth context/guest flow in this conversation,
        // we need to handle the 'customerId'.
        // The schema requires a valid user ID. 
        // IF the user is logged in, req.user.id would be available.
        // IF NOT, we might need to create a shadow user or require login.

        // Temporary Hack: use a known test user ID or failure if not auth.
        // I will just pass a placeholder ID if req.user is missing.
        const userId = req.user?.id || '00000000-0000-0000-0000-000000000000'; // Placeholder

        return await this.bookingsService.createBooking({ ...dto /*, userId */ });
    }
    @Get('provider/:providerId')
    async getProviderBookings(@Param('providerId') providerId: string) {
        return await this.bookingsService.getProviderBookings(providerId);
    }

    @Get('customer/:customerId')
    async getCustomerBookings(@Param('customerId') customerId: string) {
        return await this.bookingsService.getCustomerBookings(customerId);
    }

    @Patch(':id/status')
    async updateBookingStatus(
        @Param('id') id: string,
        @Body() body: { status: 'Accepted' | 'Rejected' | 'InProgress' | 'Completed' | 'Cancelled', providerId: string }
    ) {
        return await this.bookingsService.updateBookingStatus(id, body.status, body.providerId);
    }
}
