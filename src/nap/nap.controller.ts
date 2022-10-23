import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { NapService } from './nap.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Guards/RolesGuard';
import { AllowOnlyIf } from '../decorators/AllowOnlyIf.decorator';
import { UserRole } from '../../types';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';
import { CreateNapDto } from './dto/create-nap.dto';
import { CloseNapDto } from './dto/closeNap.dto';

@Controller('nap/:role')
export class NapController {
  constructor(private readonly napService: NapService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner', 'worker')
  saveNewNap(
    @Param('role', new ParseEnumPipe(UserRole)) role: UserRole,
    @Body() data: CreateNapDto,
    @UserObj() user: User,
  ) {
    return this.napService.createNewNap(user, role, data);
  }

  @Put('close')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner', 'worker')
  closeNap(
    @Param('role', new ParseEnumPipe(UserRole)) role: UserRole,
    @Body() data: CloseNapDto,
    @UserObj() user: User,
  ) {
    return this.napService.closeNap(user, role, data);
  }
}
