import { Module } from '@nestjs/common';
import { FieldService } from './field.service';
import { FieldController } from './field.controller';
import { HttpModule } from '@nestjs/axios';
import { FieldHelperService } from './field-helper/field-helper.service';
import { FieldDbValidatorService } from '../db-validators/field-db-validator/field-db-validator.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [FieldController],
  providers: [FieldService, FieldHelperService, FieldDbValidatorService],
})
export class FieldModule {}
