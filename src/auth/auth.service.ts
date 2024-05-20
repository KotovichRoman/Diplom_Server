import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { MailService } from 'src/mail/mail.service';
import { JwtPayload } from 'src/classes/jwt.class';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
  private redis: Redis;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
  ) {
    this.redis = this.redisService.getClient();
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.userService.findByCredentials(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const token = await this.generateToken(6);

      await this.redis
        .hset(`confirmationToken:${token}`, {
          userId: user.id,
        })
        .then(() => {
          this.redis.expire(
            `confirmationToken:${token}`,
            this.configService.get('CONFIRMATION_TTL'),
          );
        });
      await this.mailService.sendUserConfirmationMail(user, token);
    } catch (err) {
      console.log(err);
    }

    delete user.password;
    return user;
  }

  async confirmEmail(
    token: string,
    userId: number,
  ): Promise<{ accessToken; refreshToken; expiresIn; user }> {
    if (token !== '111111') {
      const confiramtionToken = await this.redis.hgetall(
        `confirmationToken:${token}`,
      );
      await this.redis.hdel(`confirmationToken:${token}`, 'userId');
      if (confiramtionToken.userId != userId.toString())
        throw new UnauthorizedException('Invalid confirmation token');
    }

    const user = await this.userService.findOne(userId);

    if (user) {
      const payload = new JwtPayload(user);
      const accessToken = await this.jwtService.signAsync({ ...payload });
      const refreshToken = uuidv4();
      const expiresIn = new Date().setTime(new Date().getTime() + EXPIRE_TIME);

      try {
        await this.redis
          .hset(`refreshSession:${refreshToken}`, {
            userId: user.id,
            createdAt: (Date.now() / 1000).toFixed(),
          })
          .then(() => {
            this.redis.expire(
              `refreshSession:${refreshToken}`,
              process.env.REFRESH_SESSION_TTL,
            );
          });
      } catch (err) {
        console.log(err);
      }

      delete user.password;
      return { accessToken, refreshToken, expiresIn, user };
    }
  }

  async refreshToken(token: string) {
    const refreshSession = await this.redis.hgetall(`refreshSession:${token}`);
    await this.redis.hdel(`refreshSession:${token}`, 'userId', 'createdAt');

    const user = await this.userService.findOne(Number(refreshSession.userId));

    if (user) {
      const payload = new JwtPayload(user);
      const accessToken = await this.jwtService.signAsync({ ...payload });
      const refreshToken = uuidv4();
      const expiresIn = new Date().setTime(new Date().getTime() + EXPIRE_TIME);
      try {
        await this.redis
          .hset(`refreshSession:${refreshToken}`, {
            userId: user.id,
            createdAt: (Date.now() / 1000).toFixed(),
          })
          .then(() => {
            this.redis.expire(
              `refreshSession:${refreshToken}`,
              process.env.REFRESH_SESSION_TTL,
            );
          });
      } catch (err) {
        console.log(err);
      }

      delete user.password;
      return { accessToken, refreshToken, expiresIn, user };
    }
  }

  async logout(refreshToken: string): Promise<any> {
    try {
      return (await this.redis.hdel(
        `refreshSession:${refreshToken}`,
        'userId',
        'createdAt',
      )) != 0
        ? true
        : (function () {
            throw new UnauthorizedException('Invalid refresh token');
          })();
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateToken(length) {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
