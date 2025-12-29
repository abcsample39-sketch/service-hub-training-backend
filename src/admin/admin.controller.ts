import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // In real app, add AdminGuard
import { AdminService } from './admin.service';
import { UpdateProviderStatusDto } from './dto/update-status.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('dashboard')
  async getDashboard() {
    return await this.adminService.getDashboardStats();
  }

  @Get('bookings')
  async getBookings() {
    return await this.adminService.getAllBookings();
  }

  @Get('providers')
  async getProviders() {
    return await this.adminService.getAllProviders();
  }

  @Get('applications')
  async getApplications() {
    return await this.adminService.getPendingApplications();
  }

  @Patch('providers/:id/status')
  async updateProviderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProviderStatusDto,
  ) {
    return await this.adminService.updateProviderStatus(id, dto);
  }
}
