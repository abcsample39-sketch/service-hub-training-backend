import { Body, Controller, Get, Post, Req, UseGuards, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProvidersService } from './providers.service';
import { ProviderOnboardingDto } from './dto/provider-onboarding.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('providers')
export class ProvidersController {
    constructor(private readonly providersService: ProvidersService) { }

    @Post('onboarding')
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(new ZodValidationPipe(ProviderOnboardingDto.schema))
    async submitOnboarding(@Req() req: any, @Body() dto: ProviderOnboardingDto) {
        const userId = req.user.userId;
        return await this.providersService.submitOnboarding(userId, dto);
    }

    @Get('status')
    @UseGuards(AuthGuard('jwt'))
    async getStatus(@Req() req: any) {
        const userId = req.user.userId;
        return await this.providersService.getProviderStatus(userId);
    }
}
