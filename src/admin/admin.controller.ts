import { Body, Controller, Get, Param, Patch, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // In real app, add AdminGuard
import { AdminService } from './admin.service';
import { UpdateProviderStatusDto } from './dto/update-status.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('applications')
    // @UseGuards(AuthGuard('jwt'), RolesGuard('Admin')) -> TODO: Add Roles Guard
    async getApplications() {
        return await this.adminService.getPendingApplications();
    }

    @Patch('applications/:id')
    // @UseGuards(AuthGuard('jwt'), RolesGuard('Admin'))
    @UsePipes(new ZodValidationPipe(UpdateProviderStatusDto.schema))
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateProviderStatusDto) {
        return await this.adminService.updateProviderStatus(id, dto);
    }
}
