import { Injectable, ExecutionContext, CanActivate, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Permission } from 'src/shared/helpers/permissions.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const isPublic = this.reflector.get<boolean>('public', context.getHandler());

        if (isPublic) {
            return true;
        }
        console.log('request0', request.user); // undefined

        // check if the user is authenticated
        const canActivate = await super.canActivate(context) as boolean;
        if (!canActivate) {
            return false;
        }

        console.log('request1', request.user); // not reached
        // check the required permissions
        const requiredPermissions = this.reflector.get<Permission[]>('permissions', context.getHandler());
        if (!requiredPermissions) {
            return true;
        }

        // check if the user has the required permissions
        const user = request.user;
        console.log('user', user);
        const hasPermission = requiredPermissions.every(permission => user.permissions.includes(permission));
        if (!hasPermission) {
            throw new ForbiddenException('Insufficient permissions');
        }
        return true;
    }
}
