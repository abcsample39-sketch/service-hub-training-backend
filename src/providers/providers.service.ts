import { Inject, Injectable } from '@nestjs/common';
import type { DrizzleDB } from '../drizzle/types';
import { providerProfiles, users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { ProviderOnboardingDto } from './dto/provider-onboarding.dto';

@Injectable()
export class ProvidersService {
  constructor(@Inject('DRIZZLE') private db: DrizzleDB) {}

  async submitOnboarding(userId: string, dto: ProviderOnboardingDto) {
    // 1. Check if user exists
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) {
      throw new Error('User not found');
    }

    // 2. Check if profile exists (upsert logic)
    const existingProfile = await this.db.query.providerProfiles.findFirst({
      where: eq(providerProfiles.userId, userId),
    });

    if (existingProfile) {
      // Update
      return await this.db
        .update(providerProfiles)
        .set({
          businessName: dto.businessName,
          address: dto.address,
          experience: dto.experience,
          bio: dto.bio,
          status: 'PENDING_APPROVAL', // Reset to pending on re-submission
        })
        .where(eq(providerProfiles.userId, userId))
        .returning();
    } else {
      // Create
      return await this.db
        .insert(providerProfiles)
        .values({
          userId,
          businessName: dto.businessName,
          address: dto.address,
          experience: dto.experience,
          bio: dto.bio,
          status: 'PENDING_APPROVAL',
        })
        .returning();
    }
  }

  // Helper to get provider status
  async getProviderStatus(userId: string) {
    return await this.db.query.providerProfiles.findFirst({
      where: eq(providerProfiles.userId, userId),
      columns: { status: true, rejectionReason: true },
    });
  }
}
