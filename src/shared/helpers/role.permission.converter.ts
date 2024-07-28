import { Injectable } from '@nestjs/common';
import { Permission } from './permissions.enum'; // Đường dẫn tới enum Permission
import { Role } from './role.enum';

@Injectable()
export class RolePermissionService {
    // Chuyển đổi role thành các quyền tương ứng
    getPermissionsFromRole(role: string): Permission[] {
        switch (role) {
            case Role.ADMIN:
                return [Permission.SYSTEM_ADMIN, Permission.USER_MANAGE, Permission.READ, Permission.WRITE, Permission.DELETE];
            case Role.USER_MANAGER:
                return [Permission.USER_MANAGE, Permission.READ, Permission.WRITE];
            case Role.USER:
                return [Permission.READ];
            default:
                return [];
        }
    }
}
