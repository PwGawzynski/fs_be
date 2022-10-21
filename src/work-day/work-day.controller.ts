import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { WorkDayService } from './work-day.service';
import { AllowOnlyIf } from '../decorators/AllowOnlyIf.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Guards/RolesGuard';
import { CreateWorkDayDto } from './dto/create-work-day.dto';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../../types';
import { CloseWorkDayDto } from './dto/close-work-day.dto';

@Controller('work-day/:role')
export class WorkDayController {
  constructor(private readonly workDayService: WorkDayService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner', 'worker')
  saveNewWorkDay(
    @Param('role', new ParseEnumPipe(UserRole)) role: UserRole,
    @Body() data: CreateWorkDayDto,
    @UserObj() user: User,
  ) {
    return this.workDayService.createNewWorkDay(data, user, role);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner', 'worker')
  getOpenWorkDay(
    @Param('role', new ParseEnumPipe(UserRole)) role: UserRole,
    @Body() data: CreateWorkDayDto,
    @UserObj() user: User,
  ) {
    return this.workDayService.getOpenWorkDay(role, data, user);
  }

  @Put('/close')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner', 'worker')
  closeWorkDay(
    @Param('role', new ParseEnumPipe(UserRole)) role: UserRole,
    @UserObj() user: User,
    @Body() data?: CloseWorkDayDto,
  ) {
    return this.workDayService.closeWorkDay(role, data, user);
  }
}
