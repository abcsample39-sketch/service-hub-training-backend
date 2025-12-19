import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
    constructor(private firebaseAdmin: FirebaseAdminService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const decodedToken = await this.firebaseAdmin.getAuth().verifyIdToken(token);
            request['user'] = decodedToken; // Attach decoded token (with uid) to request
            return true;
        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
