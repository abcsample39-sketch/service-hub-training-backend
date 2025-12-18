import { z } from 'zod';

export const updateProviderStatusSchema = z.object({
    status: z.enum(['Approved', 'Rejected']),
    rejectionReason: z.string().optional(),
});

export class UpdateProviderStatusDto {
    static schema = updateProviderStatusSchema;
    status!: 'Approved' | 'Rejected';
    rejectionReason?: string;
}
