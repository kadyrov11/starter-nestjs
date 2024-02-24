import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserModel } from '../../user/user.model';

export class IsAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: UserModel }>();
    const { isAdmin } = request.user;

    if (!isAdmin) throw new ForbiddenException('You do not have access.');

    return isAdmin;
  }
}
