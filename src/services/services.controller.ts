import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    UsePipes,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, CreateCategoryDto } from './dto/create-service.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post('categories')
    // TODO: Add Admin Guard
    @UsePipes(new ZodValidationPipe(CreateCategoryDto.schema))
    async createCategory(@Body() dto: CreateCategoryDto) {
        return await this.servicesService.createCategory(dto);
    }

    @Get('categories')
    async getCategories() {
        return await this.servicesService.getAllCategories();
    }

    @Post()
    // TODO: Add Admin Guard
    @UsePipes(new ZodValidationPipe(CreateServiceDto.schema))
    async createService(@Body() dto: CreateServiceDto) {
        return await this.servicesService.createService(dto);
    }

    @Get()
    async getServices(
        @Query('search') search?: string,
        @Query('categoryId') categoryId?: string,
    ) {
        return await this.servicesService.getAllServices(search, categoryId);
    }
}
