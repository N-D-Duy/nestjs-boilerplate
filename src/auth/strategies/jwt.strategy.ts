import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RolePermissionService } from 'src/shared/helpers/role.permission.converter';
import { UserService } from 'src/user/user.service';
import { AuthService } from "../auth.service";
import { KeyDocument } from '../schemas/key.schema';
import * as crypto from 'crypto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger('JwtStrategy');
  constructor(
    private authService: AuthService,
    @InjectModel('Key') private keyModel: Model<KeyDocument>,
    private userService: UserService,
    private rolePermissionsService: RolePermissionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKeyProvider: async (_requestType: any, token: string, done) => {
        // check if the token is valid (access token), pass it to the validate method as well
        const payload: any = this.authService.jwtService.decode(token);
        if (!payload) {
          this.logger.error('Invalid token');
          throw new UnauthorizedException('Invalid token');
        }
        //then check if the user has a key
        //if the user has a key, return the public key
        //if not, throw an error
        const key = await this.keyModel.findOne({ userId: payload.sub }).exec();
        if (!key) {
          this.logger.error('User key not found');
          throw new UnauthorizedException('User key not found');
        }
        done(null, key.publicKey);
      },
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getUserById(payload.sub);
    if (!user) {
      this.logger.error('User not found');
      throw new UnauthorizedException('User not found');
    }
    console.log('user', user);
    return { userId: user._id, email: user.email, permissions: this.rolePermissionsService.getPermissionsFromRole(user.role) };
  }
}
