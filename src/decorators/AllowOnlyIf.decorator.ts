import { SetMetadata } from '@nestjs/common';

export const AllowOnlyIf = (...roles: string[]) => SetMetadata('roles', roles);
