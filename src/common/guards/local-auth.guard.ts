import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger = new Logger('LocalAuthGuard');
  constructor(private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const loginDto: LoginDto = request.body;
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      this.logger.error('Unauthorized');
      throw new UnauthorizedException('Invalid credentials');
    }
    request.user = user;
    return true;
  }
}
