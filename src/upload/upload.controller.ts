import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Using 'any' for file type to avoid namespace issues if global Express.Multer is not set up perfectly.
// In a stricter setup we would import { Multer } from 'multer' or similar.
// But mostly commonly Method is: uploadFile(@UploadedFile() file: Express.Multer.File)
// If global Express namespace is not working, we use any.

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './public/uploads', // Ensure this dir exists
                filename: (req, file, callback) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    uploadFile(@UploadedFile() file: any) {
        // Return the URL (assuming we serve static files from /uploads)
        return {
            url: `/uploads/${file.filename}`,
            name: file.originalname,
        };
    }
}
