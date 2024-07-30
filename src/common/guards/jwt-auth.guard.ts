import { Injectable, ExecutionContext, CanActivate, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Permission } from 'src/shared/helpers/permissions.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    // check if the route is public
    const isPublic = this.reflector.get<boolean>('public', context.getHandler());
    if (isPublic) {
      return true;
    }

    const activated = await super.canActivate(context) as boolean;
    if (!activated) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const request = context.switchToHttp().getRequest();


    // check the required permissions
    const requiredPermissions = this.reflector.get<Permission[]>('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    // check if the user has the required permissions
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Insufficient permissions');
    }
    const hasPermission = requiredPermissions.every(permission => user.permissions.includes(permission));
    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }

}
