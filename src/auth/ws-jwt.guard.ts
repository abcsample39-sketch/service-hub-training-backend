import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient();
        // Expecting token in handshake query or headers
        const token = client.handshake.auth?.token || client.handshake.headers?.authorization;

        if (!token) {
            throw new UnauthorizedException('Missing auth token');
        }

        try {
            // Remove 'Bearer ' if present
            const cleanToken = token.replace('Bearer ', '');
            const secret = this.configService.get<string>('JWT_SECRET') || 'secret';

            const payload = await this.jwtService.verifyAsync(cleanToken, {
                secret,
            });

            // Attach user to client object
            client.user = payload;
            return true;
        } catch {
            throw new UnauthorizedException('Invalid auth token');
        }
    }
}
