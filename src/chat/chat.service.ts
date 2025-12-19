import { Inject, Injectable } from '@nestjs/common';
import { DrizzleDB } from '../drizzle/types';
import { chatMessages } from '../drizzle/schema';
import { eq, asc } from 'drizzle-orm';

@Injectable()
export class ChatService {
    constructor(@Inject('DRIZZLE') private db: DrizzleDB) { }

    async saveMessage(bookingId: string, senderId: string, message: string) {
        const result = await this.db.insert(chatMessages).values({
            bookingId,
            senderId,
            message,
        }).returning();
        return result[0];
    }

    async getMessages(bookingId: string) {
        return await this.db.query.chatMessages.findMany({
            where: eq(chatMessages.bookingId, bookingId),
            orderBy: [asc(chatMessages.createdAt)],
        });
    }
}
