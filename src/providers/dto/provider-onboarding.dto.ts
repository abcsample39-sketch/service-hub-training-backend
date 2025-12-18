import { z } from 'zod';

export const providerOnboardingSchema = z.object({
    businessName: z.string().min(2),
    address: z.string().min(5),
    experience: z.number().int().min(0),
    bio: z.string().optional(),
    services: z.array(z.string()).min(1, { message: "Select at least one service" }), // List of service names or IDs
});

export class ProviderOnboardingDto {
    static schema = providerOnboardingSchema;
    businessName!: string;
    address!: string;
    experience!: number;
    bio?: string;
    services!: string[];
}
