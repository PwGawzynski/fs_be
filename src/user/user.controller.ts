import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from './entities/user.entity';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/activate/:activateHash')
  async activateAccount(@Param('activateHash') activateHash: string) {
    return this.userService.activate(activateHash);
  }

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  async findAll(@UserObj() user: User) {
    return 'ok';
  }

  // This method is in charge of sending userProfilePhoto
  // which is sending with cache header for better optimisation
  @Get('/profile/photo')
  @UseGuards(AuthGuard('jwt'))
  async sendUserPhoto(
    @UserObj() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    // set headers for cache control, Etag is controlSum
    res.set({
      'Cache-Control': 'private, max-age=604800',
      ETag: user.profilePhotoPath,
    });
    return this.userService.getUserPhoto(user);
  }
}
