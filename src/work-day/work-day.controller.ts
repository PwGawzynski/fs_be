import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
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
}
