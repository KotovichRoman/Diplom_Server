import {
  Body,
  Controller,
  Post,
  Delete,
  Req,
  Res,
  Query,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { FastifyReply, FastifyRequest } from 'fastify';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/confirm')
  async resetPassword(
    @Query('device') device: string,
    @Query('token') token: string,
    @Query('id') id: number,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<{
    accessToken?: string;
    refreshToken?: string;
    expiresIn: number;
    user: User;
  }> {
    const { accessToken, refreshToken, expiresIn, user } =
      await this.authService.confirmEmail(token, id);

    if (device === 'web') {
      res.cookie('accessToken', accessToken, {
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'none',
      });
      res.cookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'none',
      });
      return { expiresIn, user };
    } else {
      return { accessToken, refreshToken, expiresIn, user };
    }
  }

  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto): Promise<User> {
    return await this.authService.loginUser(loginUserDto);
  }

  @Post('/refresh')
  async refreshToken(
    @Query('device') device: string,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<{
    accessToken?: string;
    refreshToken?: string;
    expiresIn: number;
    user: User;
  }> {
    let token: string;

    if (device === 'web') {
      token = req.cookies['refreshToken'];
    } else {
      if (req.headers.authorization.startsWith('Refresh ')) {
        token = req.headers.authorization.substring(
          8,
          req.headers.authorization.length,
        );
      }
    }

    const { accessToken, refreshToken, expiresIn, user } =
      await this.authService.refreshToken(token);

    if (device === 'web') {
      res.cookie('accessToken', accessToken, {
        path: '/',
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      });
      res.cookie('refreshToken', refreshToken, {
        path: '/',
        httpOnly: false,
        secure: true,
        sameSite: 'none',
      });
      return { expiresIn, user };
    } else {
      return { accessToken, refreshToken, expiresIn, user };
    }
  }

  @Delete('/logout')
  async logout(
    @Req() req: FastifyRequest,
    @Query('device') device?: string,
  ): Promise<User> {
    let token: string;

    if (device === 'web') {
      token = req.cookies['refreshToken'];
    } else {
      if (req.headers.authorization.startsWith('Refresh ')) {
        token = req.headers.authorization.substring(
          8,
          req.headers.authorization.length,
        );
      }
    }

    return await this.authService.logout(token);
  }
}
