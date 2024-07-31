import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model, Types } from 'mongoose';
import { comparePasswords } from 'src/shared/utils/hash-password.utils';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { KeyDocument } from './schemas/key.schema';

const logger = new Logger('AuthService');
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    public jwtService: JwtService,
    @InjectModel('Key') private keyModel: Model<KeyDocument>
  ) { }

  // check if user exists and password is correct
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await comparePasswords(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.validateUser(email, password);
    logger.log('User:', user);
    if (!user) {
      logger.error('Invalid credentials');
      throw new UnauthorizedException('Invalid credentials');
    }
    const key = await this.keyModel.findOne({ userId: user._id }).exec();
    if (!key) {
      logger.error('User key not found');
      throw new UnauthorizedException('User key not found');
    }
    const payload = { email: user.email, sub: user._id };

    const tokens = await this.reCreateTokenPair(payload, key);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async reCreateTokenPair(payload: object, key: KeyDocument): Promise<{ accessToken: string, refreshToken: string }> {
    const tokens = await this.createTokenPair(payload, key.publicKey, key.privateKey);
    if (!tokens) {
      throw new UnauthorizedException('Error creating tokens, please try again (null)');
    }
    //delete old refresh tokens and save new one
    key.refreshTokens.push(tokens.refreshToken);
    await key.save();
    return tokens;
  }

  async signup(createUserDto: CreateUserDto) {
    //check if email is already in use
    const userCheck = await this.userService.findByEmail(createUserDto.email);
    if (userCheck) {
      throw new UnauthorizedException('Email already in use');
    }
    const newUser = await this.userService.create(createUserDto);
    if (newUser) {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      });

      const publicKeyString = await this.saveKey(newUser._id, publicKey.toString(), privateKey.toString());
      if (!publicKeyString) {
        throw new UnauthorizedException('Error saving public key, please try again');
      }
      const tokens = await this.createTokenPair({ email: newUser.email, sub: newUser._id }, publicKey, privateKey);
      if (!tokens) {
        throw new UnauthorizedException('Error creating tokens, please try again (null)');
      }
      //save refresh token to database
      const refreshToken = tokens.refreshToken;
      const key = await this.keyModel.findOne({ userId: newUser._id }).exec();
      if (!key) {
        throw new UnauthorizedException('User key not found');
      }

      key.refreshTokens.push(refreshToken);
      await key.save();

      return {
        code: 200,
        message: 'User created successfully',
        tokens: tokens.accessToken,
      };
    }
    return {
      code: 500,
      message: 'User creation failed',
    };
  }


  async saveKey(userId: Types.ObjectId, publicKey: String, privateKey: String): Promise<String> {
    //handle key saving
    try {
      const publicKeyString = publicKey.toString();
      const tokens = await this.keyModel.create({
        userId: userId,
        publicKey: publicKey,
        privateKey: privateKey,
      });
      return tokens ? publicKeyString : null;
    } catch (e) {
      throw new UnauthorizedException('Error saving public key, please try again');
    }
  }


  async createTokenPair(payload: object, publicKey: string, privateKey: string): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      
      const accessToken = await this.jwtService.signAsync(payload, { secret: privateKey, algorithm: 'RS256', expiresIn: '15m' });
      const refreshToken = await this.jwtService.signAsync(payload, { secret: privateKey, algorithm: 'RS256', expiresIn: '7d' });

      //test verify
      const decode = this.jwtService.verify(accessToken, {publicKey: publicKey});
      console.log('decode', decode);
  
      return { accessToken, refreshToken };
    }
    catch (e) {
      console.error('JWT Sign Error:', e);
      throw new UnauthorizedException('Error creating tokens, please try again (create)', e);
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponseDto> {
    try {
      // Lấy thông tin payload từ refresh token
      const payload = this.jwtService.decode(refreshToken);
      if (!payload) {
        throw new UnauthorizedException('Invalid token, decode not found');
      }
      // Lấy public/private key của người dùng
      const key = await this.keyModel.findOne({ userId: payload.sub }).exec();
      if (!key) {
        throw new UnauthorizedException('User key not found');
      }

      // Kiểm tra xem refresh token có còn hợp lệ hay không
      if (!key.refreshTokens.includes(refreshToken)) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      //verify token
      const verify = this.jwtService.verify(refreshToken, { publicKey: key.publicKey, ignoreExpiration: false });
      if(!verify) {
        throw new UnauthorizedException('Invalid refresh token or expired');
      }
  
      // Tạo payload mới cho token mới
      const newPayload = { email: payload.email, sub: payload._id };
  
      // Tạo cặp token mới
      const tokens = await this.reCreateTokenPair(newPayload, key);

      // Xóa refresh token cũ và lưu refresh token mới
      key.refreshTokens = key.refreshTokens.filter(token => token !== refreshToken);
      key.refreshTokens.push(tokens.refreshToken);
      await key.save();
  
      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
  
}
