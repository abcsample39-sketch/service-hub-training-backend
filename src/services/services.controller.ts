import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ServicesService } from './services.service';
import { CreateServiceDto, CreateCategoryDto } from './dto/create-service.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post('categories')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin')
    @UsePipes(new ZodValidationPipe(CreateCategoryDto.schema))
    async createCategory(@Body() dto: CreateCategoryDto) {
        return await this.servicesService.createCategory(dto);
    }

    @Get('categories')
    async getCategories() {
        return await this.servicesService.getAllCategories();
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('Admin')
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

    @Get(':id')
    async getServiceById(@Param('id') id: string) {
        return await this.servicesService.getServiceById(id);
    }
}
