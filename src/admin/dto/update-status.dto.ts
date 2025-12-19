import { z } from 'zod';

export const updateProviderStatusSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  rejectionReason: z.string().optional(),
});

export class UpdateProviderStatusDto {
  static schema = updateProviderStatusSchema;
  status!: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}
