import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FieldService } from './field.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Guards/RolesGuard';
import { AllowOnlyIf } from '../decorators/AllowOnlyIf.decorator';
import { CreateFieldDto } from './dto/create-field.dto';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';

@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner', 'client')
  create(@Body() data: CreateFieldDto, @UserObj() user: User) {
    return this.fieldService.createNewField(data, user);
  }
}
