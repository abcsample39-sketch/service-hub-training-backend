import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Get(':bookingId')
    async getMessages(@Param('bookingId') bookingId: string) {
        return await this.chatService.getMessages(bookingId);
    }
}
