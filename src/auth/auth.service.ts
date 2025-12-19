import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DRIZZLE_DB } from '../drizzle/drizzle.module';
// Use 'node-postgres' type for now or infer
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type DrizzleDB = NodePgDatabase<typeof schema>;

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE_DB) private db: DrizzleDB,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, registerDto.email));
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const [newUser] = await this.db
      .insert(users)
      .values({
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        phoneNumber: registerDto.phoneNumber,
        role: registerDto.role || 'Customer',
      })
      .returning();

    return this.generateToken(newUser);
  }

  async login(loginDto: LoginDto) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, loginDto.email));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: typeof users.$inferSelect) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
