import { Inject, Injectable } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login-dto';
import { Response } from 'express';
import { User } from '../user/entities/user.entity';
import { hashPwd } from '../utils/hash-pwd';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwt-strateg';
import { UniversalResponseObject } from '../../types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  // constructor takes ConfigService with gives access to config data
  constructor(
    @Inject(ConfigService) private readonly ConfigService: ConfigService,
  ) {}

  // method creates authToken for cookie
  private createToken(currentTokenId: string): {
    accessToken: string;
    expiresIn: number;
  } {
    const payload: JwtPayload = { id: currentTokenId };
    const expiresIn = 60 * 60 * 24;
    const accessToken = sign(
      payload,
      this.ConfigService.get<string>('authStrategy.sign'),
      {
        expiresIn,
      },
    );
    return {
      accessToken,
      expiresIn,
    };
  }

  private static async generateToken(user: User) {
    let token;
    let userWithThisToken = null;
    do {
      token = uuid();
      console.log(token);
      userWithThisToken = await User.findOne({
        where: {
          currentTokenId: token,
        },
      });
    } while (!!userWithThisToken);
    user.currentTokenId = token;
    await user.save();
    return token;
  }

  //login strategy
  async login(req: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await User.findOne({
        where: {
          login: req.login,
          pwdHashed: hashPwd(req.password),
        },
      });
      if (!user) {
        return res.json({
          status: false,
          message: "User doesn't exist",
        } as UniversalResponseObject);
      }
      if (!user.activated) {
        return res.json({
          status: false,
          message: 'Unactivated Account',
        } as UniversalResponseObject);
      }
      const token = await this.createToken(
        await AuthService.generateToken(user),
      );
      // TODO on production change cookie setting to secure
      return res
        .cookie('jwt', token.accessToken, {
          secure: false,
          domain: 'localhost',
          httpOnly: true,
        })
        .json({
          status: true,
        } as UniversalResponseObject);
    } catch (e) {
      console.log(e);
    }
  }

  // used when logOut
  async logout(user: User, res: Response) {
    try {
      user.currentTokenId = null;
      await user.save();
      res
        .clearCookie('jwt', {
          secure: false,
          domain: 'localhost',
          httpOnly: true,
        })
        .json({
          status: true,
        } as UniversalResponseObject);
    } catch (e) {}
  }
}
