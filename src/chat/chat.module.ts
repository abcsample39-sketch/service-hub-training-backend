import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [DrizzleModule, AuthModule],
    controllers: [ChatController],
    providers: [ChatGateway, ChatService],
})
export class ChatModule { }
