import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login-dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO change promise return type to interface
  @Post('login')
  async login(@Body() req: AuthLoginDto, @Res() res: Response): Promise<any> {
    return this.authService.login(req, res);
  }
}
