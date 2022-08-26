import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userService.create(createUserDto);
  }

  // @Get('/test')
  // @UseGuards(AuthGuard('jwt'))
  // findAll(@UserObj() user: User) {
  //   console.log(user);
  //   return this.userService.findAll();
  // }
}
