import { Injectable, Inject } from '@nestjs/common';
import type { DrizzleDB } from '../drizzle/types';
import { users, userAddresses } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
    constructor(@Inject('DRIZZLE') private db: DrizzleDB) { }

    async syncUser(firebaseUser: { uid: string; email: string; name?: string; picture?: string }) {
        const { uid, email, name } = firebaseUser;

        // Check if user exists by firebaseUid
        const existing = await this.db.query.users.findFirst({
            where: eq(users.firebaseUid, uid)
        });

        if (existing) return existing;

        // Check if user exists by email (legacy account linkage)
        const existingByEmail = await this.db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (existingByEmail) {
            // Link them
            await this.db.update(users).set({ firebaseUid: uid }).where(eq(users.id, existingByEmail.id));
            return { ...existingByEmail, firebaseUid: uid };
        }

        // Create new user
        const [newUser] = await this.db.insert(users).values({
            email: email,
            name: name || 'User',
            password: 'FIREBASE_AUTH', // Placeholder or managed differently
            role: 'Customer',
            firebaseUid: uid,
        }).returning();

        return newUser;
    }

    async addAddress(firebaseUid: string, addressData: typeof userAddresses.$inferInsert) {
        const user = await this.db.query.users.findFirst({
            where: eq(users.firebaseUid, firebaseUid)
        });

        if (!user) throw new Error('User not found');

        return await this.db.insert(userAddresses).values({
            ...addressData,
            userId: user.id
        }).returning();
    }

    async getAddresses(firebaseUid: string) {
        const user = await this.db.query.users.findFirst({
            where: eq(users.firebaseUid, firebaseUid)
        });

        if (!user) return [];

        return await this.db.query.userAddresses.findMany({
            where: eq(userAddresses.userId, user.id)
        });
    }
}
