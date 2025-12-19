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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin')
  async getDashboard() {
    return await this.adminService.getDashboardStats();
  }

  @Get('bookings')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin')
  async getBookings() {
    return await this.adminService.getAllBookings();
  }

  @Get('providers')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin')
  async getProviders() {
    return await this.adminService.getAllProviders();
  }

  @Get('applications')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin')
  async getApplications() {
    return await this.adminService.getPendingApplications();
  }

  @Patch('providers/:id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin') // Assuming updateStatus was applications/:id before, now generalizing or adding specific provider route
  async updateProviderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProviderStatusDto,
  ) {
    return await this.adminService.updateProviderStatus(id, dto);
  }
}
