import { Inject, Injectable } from '@nestjs/common';
import type { DrizzleDB } from '../drizzle/types';
import { serviceCategories, services } from '../drizzle/schema';
import { eq, ilike } from 'drizzle-orm';
import { CreateServiceDto, CreateCategoryDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
    constructor(@Inject('DRIZZLE') private db: DrizzleDB) { }

    async createCategory(dto: CreateCategoryDto) {
        return await this.db.insert(serviceCategories).values(dto).returning();
    }

    async getAllCategories() {
        return await this.db.select().from(serviceCategories);
    }

    async createService(dto: CreateServiceDto) {
        return await this.db
            .insert(services)
            .values({
                name: dto.name,
                description: dto.description,
                price: dto.price.toString(), // Drizzle decimal expects string
                duration: dto.duration,
                categoryId: dto.categoryId,
                image: dto.image,
            })
            .returning();
    }

    async getAllServices(search?: string, categoryId?: string) {
        const baseQuery = this.db
            .select({
                id: services.id,
                name: services.name,
                description: services.description,
                price: services.price,
                duration: services.duration,
                image: services.image,
                rating: services.rating,
                reviewCount: services.reviewCount,
                categoryId: services.categoryId,
                categoryName: serviceCategories.name
            })
            .from(services)
            .leftJoin(serviceCategories, eq(services.categoryId, serviceCategories.id));

        // Use dynamic import for 'and' to avoid top-level conflict if any, 
        // or better yet, just handle the logic cleanly with if/else as before but correctly typed.
        // Since we are inside an async function, dynamic import is fine.
        const { and } = await import('drizzle-orm');

        if (search && categoryId) {
            baseQuery.where(and(ilike(services.name, `%${search}%`), eq(services.categoryId, categoryId)));
        } else if (search) {
            baseQuery.where(ilike(services.name, `%${search}%`));
        } else if (categoryId) {
            baseQuery.where(eq(services.categoryId, categoryId));
        }

        return await baseQuery;
    }
}
