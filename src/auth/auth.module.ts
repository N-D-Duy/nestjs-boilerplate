import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { RolePermissionService } from 'src/shared/helpers/role.permission.converter';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KeySchema } from './schemas/key.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Key', schema: KeySchema }]),
        UserModule,
        PassportModule,
        JwtModule.register({
            global: true,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, RolePermissionService],
    exports: [AuthService],
})
export class AuthModule {}