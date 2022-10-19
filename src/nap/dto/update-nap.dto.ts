import { PartialType } from '@nestjs/mapped-types';
import { CreateNapDto } from './create-nap.dto';

export class UpdateNapDto extends PartialType(CreateNapDto) {}
