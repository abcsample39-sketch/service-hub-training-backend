import { Controller, Get, Post, Patch, Body, Query, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '@nestjs/passport';

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
    @UseGuards(AuthGuard('jwt'))
    async createBooking(@Body() dto: CreateBookingDto, @Request() req) {
        return await this.bookingsService.createBooking(dto, req.user.id);
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
