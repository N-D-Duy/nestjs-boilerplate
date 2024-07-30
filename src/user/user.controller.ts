import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { User } from "./schema/user.schema";
import { UserService } from "./user.service";
import { Permissions } from "../common/guards/permissions/permission.decorator.guard";
import { Permission } from "src/shared/helpers/permissions.enum";

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Permissions(Permission.SYSTEM_ADMIN)
    @Get()
    getUsers(): Promise<User[]> {
        return this.userService.getUsers();
    }

    @Get(':id')
    getUserById(@Param('id') uid: string): Promise<User> {
        return this.userService.getUserById(uid);
    }
}