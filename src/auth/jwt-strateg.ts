import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
export interface JwtPayload {
  id: string;
}

const cookieExtractor = (req: any): null | string => {
  return req && req.cookies ? req.cookies?.jwt ?? null : null;
};

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // TODO add .env for secret key below
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey:
        'aioubnfiunb[oupsbreiuhrbpsiabuhrguiabipuhgbaiupjhfr[gjhiudnjzpivvnbuipharjsoptiungabipuhefjo[auh[ouafioh' +
        'eifojapoiusnrgfuhgirspujhgo[ghaiphjao[ijgpuihj[higrvaiounbphvipaunraiouji' +
        'aighewraipuhnoughraiojieohufhaj[oiehfoagupgb`iuhagriuojg[ohiauhngb[ahguaoirhioagiuorabo[irsoahiub[rgfiaorhiugarhgu[',
    });
  }
  async validate(payload: JwtPayload, done: (error, user) => void) {
    if (!payload || !payload.id) {
      return done(new UnauthorizedException(), false);
    }
    const user = await User.findOne({
      where: {
        currentTokenId: payload.id,
      },
    });
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, user);
  }
}
