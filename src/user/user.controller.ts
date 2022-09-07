import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Header,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from './entities/user.entity';

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

  @Get('/profile/photo')
  @UseGuards(AuthGuard('jwt'))
  @Header('Cache-Control', 'private, max-age=604800')
  //TODO chnage photo name in files that it can be etag
  @Header('ETag', 'filename')
  async sendUserPhoto(@UserObj() user: User) {
    return this.userService.getUserPhoto(user);
  }
}
