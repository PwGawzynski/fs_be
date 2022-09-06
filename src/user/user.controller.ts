import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('/activate/:activateHash')
  activateAccount(@Param('activateHash') activateHash: string) {
    return this.userService.activate(activateHash);
  }

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  findAll(@UserObj() user: User) {
    return 'ok';
  }
}
