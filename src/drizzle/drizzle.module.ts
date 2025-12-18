import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';
import { Global, Module, Provider } from '@nestjs/common';

export const DRIZZLE_DB = 'DRIZZLE_DB';

const drizzleProvider: Provider = {
  provide: DRIZZLE_DB,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      throw new Error('DATABASE_URL is not defined');
    }
    const pool = new Pool({
      connectionString,
    });
    return drizzle(pool, { schema });
  },
};

@Global()
@Module({
  providers: [drizzleProvider],
  exports: [DRIZZLE_DB],
})
export class DrizzleModule { }
