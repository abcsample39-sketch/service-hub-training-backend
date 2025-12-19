import { z } from 'zod';

export const createBookingSchema = z.object({
    providerId: z.string().uuid(),
    serviceId: z.string().uuid(),
    date: z.string().datetime(), // ISO date string
    customerName: z.string().min(2),
    customerEmail: z.string().email(),
    customerPhone: z.string().min(10),
    address: z.string().min(5),
});

export class CreateBookingDto {
    static schema = createBookingSchema;
    providerId!: string;
    serviceId!: string;
    date!: string;
    customerName!: string;
    customerEmail!: string;
    customerPhone!: string;
    address!: string;
}
