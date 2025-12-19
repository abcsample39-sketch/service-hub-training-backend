import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { WsJwtGuard } from '../auth/ws-jwt.guard';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3000',
        credentials: true,
    },
})
@UseGuards(WsJwtGuard)
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatService: ChatService) { }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @MessageBody() bookingId: string,
        @ConnectedSocket() client: Socket,
    ) {
        client.join(bookingId);
        console.log(`Client ${client.id} joined room ${bookingId}`);
        return { event: 'joined', room: bookingId };
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @MessageBody() payload: { bookingId: string; senderId: string; message: string },
        @ConnectedSocket() client: Socket,
    ) {
        // Save to DB
        const savedMessage = await this.chatService.saveMessage(
            payload.bookingId,
            payload.senderId,
            payload.message,
        );

        // Broadcast to room
        this.server.to(payload.bookingId).emit('newMessage', savedMessage);

        return savedMessage;
    }
}
