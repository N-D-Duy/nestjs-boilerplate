import { Controller, Post, UseGuards, Request, Body, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';
import { Public } from 'src/common/guards/permissions/permission.decorator.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Public()
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Successful login', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ description: 'email and password', type: LoginDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('signup')
  @ApiBody({type: CreateUserDto})
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('protected')
  getProtectedResource(@Request() req) {
    return req.user;
  }

  @Public()
  @ApiOperation({ summary: 'Refresh Token' })
  @ApiResponse({ status: 200, description: 'New tokens', type: LoginResponseDto})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ description: 'Refresh token', schema: { type: 'object', properties: { refreshToken: { type: 'string' } }, required: ['refreshToken'] } })
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }
}
