import { Inject, Injectable } from '@nestjs/common';
import { DrizzleDB } from '../drizzle/types';
import { providerProfiles, users } from '../drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { UpdateProviderStatusDto } from './dto/update-status.dto';

@Injectable()
export class AdminService {
    constructor(@Inject('DRIZZLE') private db: DrizzleDB) { }

    async getPendingApplications() {
        // Fetch profiles with status 'Pending' + user details
        const result = await this.db.select({
            id: providerProfiles.id,
            userId: providerProfiles.userId,
            businessName: providerProfiles.businessName,
            address: providerProfiles.address,
            experience: providerProfiles.experience,
            status: providerProfiles.status,
            user: {
                name: users.name,
                email: users.email,
                phoneNumber: users.phoneNumber,
            }
        })
            .from(providerProfiles)
            .innerJoin(users, eq(providerProfiles.userId, users.id))
            .where(eq(providerProfiles.status, 'Pending'));

        return result;
    }

    async updateProviderStatus(profileId: string, dto: UpdateProviderStatusDto) {
        return await this.db.update(providerProfiles)
            .set({
                status: dto.status,
                rejectionReason: dto.rejectionReason,
            })
            .where(eq(providerProfiles.id, profileId))
            .returning();
    }
}
