import { Inject, Injectable } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth-login-dto';
import { Response } from 'express';
import { User } from '../user/entities/user.entity';
import { hashPwd } from '../utils/hash-pwd';
import { v4 as uuid } from 'uuid';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from './jwt-strateg';
import { UniversalResponseObject, UserRolesObj } from '../../types';
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
          account: {
            currentTokenId: token,
          },
        },
        relations: ['account'],
      });
    } while (!!userWithThisToken);
    user.account.currentTokenId = token;
    console.log(user, 'GEN TOKEN');
    await user.account.save();
    await user.save();
    return token;
  }

  private static async validateUser(
    req: AuthLoginDto,
    res: Response,
  ): Promise<User | undefined> {
    const user = await User.findOne({
      where: {
        account: {
          login: req.login,
          pwdHashed: hashPwd(req.password),
        },
      },
      relations: ['account', 'roles'],
    });

    if (!user) {
      res.json({
        status: false,
        message: "User doesn't exist",
      } as UniversalResponseObject);
      return undefined;
    }
    if (!user.account.activated) {
      res.json({
        status: false,
        message: 'Unactivated Account',
      } as UniversalResponseObject);
      return undefined;
    }

    return user;
  }

  //login strategy
  async login(req: AuthLoginDto, res: Response): Promise<any> {
    try {
      const user = await AuthService.validateUser(req, res);
      if (!user) return;
      // to prevent leaked id of  user's roles entity
      const resRoles = {
        IsOwner: user?.roles.IsOwner,
        IsWorker: user?.roles.IsWorker,
      } as UserRolesObj;

      const token = await this.createToken(
        await AuthService.generateToken(user),
      );
      // TODO on production change cookie setting to secure
      return res
        .status(200)
        .cookie(
          'jwt',
          token.accessToken /*{
          secure: false,
          domain: 'localhost',
          httpOnly: true,
        }*/,
        )
        .json({
          status: true,
          data: resRoles,
        } as UniversalResponseObject);
    } catch (e) {
      console.log(e);
    }
  }

  // used when logOut
  async logout(user: User, res: Response) {
    try {
      user.account.currentTokenId = null;
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
