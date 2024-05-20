import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { FastifyRequest } from 'fastify/types/request';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: configService.getOrThrow('IGNORE_EXPIRATION'),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { ...payload };
  }
}

const cookieExtractor = function (req: FastifyRequest) {
  let accessToken = null;
  if (req && req.cookies) {
    accessToken = req.cookies['accessToken'];
  }
  return accessToken;
};
