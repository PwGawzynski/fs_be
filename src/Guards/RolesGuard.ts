import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRolesObj } from '../../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private checkRoles(userRoles: UserRolesObj, allowedRoles: string[]) {
    return allowedRoles
      .map((role) => userRoles[role] ?? false)
      .find((value) => value === true);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(context.switchToHttp().getRequest().user);
    const userRoles = context.switchToHttp().getRequest().user
      .roles as UserRolesObj;
    return this.checkRoles(userRoles, allowedRoles);
  }
}
