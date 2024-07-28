import { SetMetadata } from '@nestjs/common';
import { Permission } from 'src/shared/helpers/permissions.enum';

export const Permissions = (...permissions: Permission[]) => SetMetadata('permissions', permissions);
export const Public = () => SetMetadata('public', true);
