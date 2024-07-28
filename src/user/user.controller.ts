import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { User } from "./schema/user.schema";
import { UserService } from "./user.service";
import { Permission } from "src/shared/helpers/permissions.enum";
import { Permissions } from "src/common/guards/permissions/permission.decorator.guard";
import { ApiBearerAuth, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags('user')

@Controller('user')
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) {}
    @UseGuards(JwtAuthGuard)
    @Permissions(Permission.READ)
    @Get()
    getUsers(): Promise<User[]> {
        return this.userService.getUsers();
    }

    @Get(':id')
    getUserById(@Param('id') uid: string): Promise<User> {
        return this.userService.getUserById(uid);
    }
}