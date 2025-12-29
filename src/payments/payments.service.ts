import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor() {
        const apiKey = process.env.STRIPE_SECRET_KEY;
        if (!apiKey) {
            console.warn('⚠️ STRIPE_SECRET_KEY is not defined. Payment features will fail.');
        } else {
            console.log(`🔑 Stripe key loaded: ${apiKey.startsWith('sk_test_') ? 'TEST' : 'LIVE'} mode`);
            console.log(`Stripe account ID: ${apiKey.substring(8, 32)}`);
            this.stripe = new Stripe(apiKey, {
                apiVersion: '2024-12-18.acacia' as any,
            });
        }
    }

    async createPaymentIntent(amount: number, currency: string = 'inr') {
        if (!this.stripe) {
            console.error('Stripe not initialized: STRIPE_SECRET_KEY missing');
            throw new Error('Cannot create payment intent: STRIPE_SECRET_KEY is missing.');
        }

        if (amount <= 0) {
            console.error(`Invalid amount: ${amount}`);
            throw new Error('Invalid payment amount');
        }

        const amountInCents = Math.round(amount * 100);
        console.log(`Creating payment intent: amount=${amount}, currency=${currency}, amountInCents=${amountInCents}`);

        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amountInCents, // convert to paisa/cents
                currency,
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            console.log(`Payment intent created: ${paymentIntent.id}`);
            return paymentIntent;
        } catch (error) {
            console.error('Stripe API error:', error);
            throw error;
        }
    }
}
