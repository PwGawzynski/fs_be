import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
export interface JwtPayload {
  id: string;
}

const cookieExtractor = (req: any): null | string => {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
};

// class used to set up jwt strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // constructor takes ConfigService with gives access to config data
  constructor(@Inject(ConfigService) readonly ConfigService: ConfigService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: ConfigService.get<string>('authStrategy.sign'),
    });
  }

  // this method validates given in req data, checks if it  contains obligated data fields.
  async validate(payload: JwtPayload, done: (error, user) => void) {
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }
    const user = await User.findOne({
      where: {
        account: {
          currentTokenId: payload.id,
        },
      },
      relations: ['account'],
    });
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, user);
  }
}
