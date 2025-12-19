import { z } from 'zod';

export const createServiceSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    price: z.number().min(0),
    duration: z.number().int().min(1),
    categoryId: z.string().uuid(),
    image: z.string().url().optional().or(z.literal('')),
});

export class CreateServiceDto {
    static schema = createServiceSchema;
    name!: string;
    description?: string;
    price!: number;
    duration!: number;
    categoryId!: string;
    image?: string;
}

export const createCategorySchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
});

export class CreateCategoryDto {
    static schema = createCategorySchema;
    name!: string;
    description?: string;
}
