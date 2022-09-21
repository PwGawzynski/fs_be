import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FieldService } from './field.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { User } from '../user/entities/user.entity';
import { UserObj } from '../decorators/user-obj.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Guards/RolesGuard';
import { AllowOnlyIf } from '../decorators/AllowOnlyIf.decorator';

@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner')
  setUpNewField(@Body() data: CreateFieldDto, @UserObj() user: User) {
    return this.fieldService.create(data, user);
  }
}
