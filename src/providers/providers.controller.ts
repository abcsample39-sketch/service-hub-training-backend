import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProvidersService } from './providers.service';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) { }

  @Get('status')
  @UseGuards(AuthGuard('jwt'))
  async getStatus(@Req() req: any) {
    const userId = req.user.userId;
    return await this.providersService.getProviderStatus(userId);
  }

  @Get() // Public endpoint to list providers
  async findAll() {
    // For now, return the mock data we used in frontend or fetch from DB
    // Since we don't have a specific service method for 'findAll' with search yet, 
    // we can return the mock data to satisfy the frontend call
    return [
      { id: 'p2', userId: 'u2', businessName: 'QuickFix Plumbers', bio: '24/7 Plumbing', rating: '4.5', experience: 10, address: '5.0 km away' }
    ];
  }

  @Post('services')
  @UseGuards(AuthGuard('jwt'))
  async addService(@Req() req: any, @Body('serviceId') serviceId: string) {
    if (!serviceId) return { error: 'Service ID required' };
    return await this.providersService.addServiceToProvider(req.user.userId, serviceId);
  }
}
