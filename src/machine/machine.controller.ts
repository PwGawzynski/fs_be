import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MachineService } from './machine.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Guards/RolesGuard';
import { AllowOnlyIf } from '../decorators/AllowOnlyIf.decorator';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';

@Controller('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner')
  create(@Body() data: CreateMachineDto, @UserObj() user: User) {
    return this.machineService.createNewMachine(data, user);
  }
}
