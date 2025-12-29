import { Inject, Injectable } from '@nestjs/common';
import type { DrizzleDB } from '../drizzle/types';
import { providerProfiles, users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';


@Injectable()
export class ProvidersService {
  constructor(@Inject('DRIZZLE') private db: DrizzleDB) { }

  // Helper to get provider status
  async getProviderStatus(userId: string) {
    return await this.db.query.providerProfiles.findFirst({
      where: eq(providerProfiles.userId, userId),
      columns: { status: true, rejectionReason: true },
    });
  }

  async addServiceToProvider(userId: string, serviceId: string) {
    const provider = await this.db.query.providerProfiles.findFirst({
      where: eq(providerProfiles.userId, userId),
    });

    if (!provider) {
      // Auto-create profile if missing (simplified flow)
      const [newProvider] = await this.db.insert(providerProfiles).values({
        userId: userId,
        status: 'APPROVED', // Auto-approve for now based on simplifying onboarding
        isVerified: true,
        services: [serviceId]
      }).returning();
      return newProvider;
    }

    // Append service if not exists (Postgres array append approach manually for array<text>)
    // Drizzle doesn't support array_append easily in update object yet for pg, easiest is read-modify-write for this scale
    const currentServices = provider.services || [];
    if (!currentServices.includes(serviceId)) {
      await this.db.update(providerProfiles)
        .set({ services: [...currentServices, serviceId] })
        .where(eq(providerProfiles.id, provider.id));
    }

    return { success: true };
  }
}
