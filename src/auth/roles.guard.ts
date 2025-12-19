import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport'; // Ensure we extend or use alongside AuthGuard

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        // User role should match one of the required roles
        // user.role is likely 'Admin', 'Customer', 'Provider'
        // Case sensitivity might matter, schema uses Capitalized keys in Enum? No, schema 'userRoleEnum' has 'Customer', 'Provider', 'Admin'

        return requiredRoles.some((role) => user?.role === role);
    }
}
