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
    const userId = req.user.id;
    return await this.providersService.getProviderStatus(userId);
  }

  @Get() // Public endpoint to list providers
  async findAll() {
    return await this.providersService.findAll();
  }

  @Post('services')
  @UseGuards(AuthGuard('jwt'))
  async addService(@Req() req: any, @Body('serviceId') serviceId: string) {
    if (!serviceId) return { error: 'Service ID required' };
    return await this.providersService.addServiceToProvider(req.user.id, serviceId);
  }
}
