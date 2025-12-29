import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create-intent')
    async createPaymentIntent(@Body() body: { amount: number }) {
        const paymentIntent = await this.paymentsService.createPaymentIntent(body.amount);
        return {
            clientSecret: paymentIntent.client_secret,
        };
    }
}
