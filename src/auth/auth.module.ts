import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from './guard/jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '20s' },
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRoot({
      config: {
        name: 'main',
        host: 'localhost',
        port: 6379,
        username: 'default',
        password: 'password',
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtGuard],
  exports: [AuthService, JwtStrategy, JwtGuard],
  controllers: [AuthController],
})
export class AuthModule {}
