import { Inject, Injectable } from '@nestjs/common';
import type { DrizzleDB } from '../drizzle/types';
import { serviceCategories, services } from '../drizzle/schema';
import { eq, ilike, and } from 'drizzle-orm';
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
                imageUrl: dto.image, // Use correct column name from schema
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
                imageUrl: services.imageUrl,
                categoryId: services.categoryId,
                categoryName: serviceCategories.name
            })
            .from(services)
            .leftJoin(serviceCategories, eq(services.categoryId, serviceCategories.id))
            .$dynamic();

        if (search && categoryId) {
            return await baseQuery.where(and(ilike(services.name, `%${search}%`), eq(services.categoryId, categoryId)));
        } else if (search) {
            return await baseQuery.where(ilike(services.name, `%${search}%`));
        } else if (categoryId) {
            return await baseQuery.where(eq(services.categoryId, categoryId));
        }

        return await baseQuery;
    }
}
