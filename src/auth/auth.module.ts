import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { KeySchema } from './schemas/key.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RolePermissionService } from 'src/shared/helpers/role.permission.converter';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Key', schema: KeySchema }]),
        UserModule,
        PassportModule,
        JwtModule.register({
            global: true,
            signOptions: { expiresIn: '60m' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, RolePermissionService],
})
export class AuthModule {}
