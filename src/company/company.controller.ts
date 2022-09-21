import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../Guards/RolesGuard';
import { AllowOnlyIf } from '../decorators/AllowOnlyIf.decorator';
import { UserObj } from '../decorators/user-obj.decorator';
import { User } from '../user/entities/user.entity';

@Controller()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @AllowOnlyIf('owner')
  createNew(@Body() data: CreateCompanyDto, @UserObj() user: User) {
    return this.companyService.createCompany(data, user);
  }
}
