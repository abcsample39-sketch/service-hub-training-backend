import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';
import { Global, Module, Provider } from '@nestjs/common';

export const DRIZZLE_DB = 'DRIZZLE_DB';
export const DRIZZLE = 'DRIZZLE'; // Alias for backwards compatibility

const drizzleProvider: Provider = {
  provide: DRIZZLE_DB,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }
    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }, // Required for Neon DB
    });
    return drizzle(pool, { schema });
  },
};

// Alias provider for services using 'DRIZZLE' token
const drizzleAliasProvider: Provider = {
  provide: DRIZZLE,
  inject: [DRIZZLE_DB],
  useFactory: (db: any) => db,
};

@Global()
@Module({
  providers: [drizzleProvider, drizzleAliasProvider],
  exports: [DRIZZLE_DB, DRIZZLE],
})
export class DrizzleModule { }

