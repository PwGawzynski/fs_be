import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
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
    switch (role) {
      case UserRole.owner:
        return this.napService.createNewNap(user, role, data);
        break;
      case UserRole.worker:
        return this.napService.createNewNap(user, role);
    }
  }
}
