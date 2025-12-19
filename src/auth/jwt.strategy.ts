import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DRIZZLE_DB } from '../drizzle/drizzle.module';
import { Inject } from '@nestjs/common';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { DrizzleDB } from '../drizzle/types'; // We might need to define this type or infer it

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @Inject(DRIZZLE_DB) private db: DrizzleDB,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secret', // Fallback for dev
    });
  }

  async validate(payload: any) {
    // payload: { sub: userId, email: userEmail, role: userRole }
    // Check if user exists (optional, but good for security)
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
