import { z } from 'zod'; // turbo

export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phoneNumber: z
    .string()
    .regex(/^(\+91[\-\s]?)?[0-9]{10}$/, { message: 'Invalid Phone Number' })
    .optional(),
  role: z.enum(['Customer', 'Provider']).optional(),
});

export class RegisterDto {
  static schema = registerSchema;
  email!: string;
  password!: string;
  name!: string;
  phoneNumber?: string;
  role?: 'Customer' | 'Provider';
}
