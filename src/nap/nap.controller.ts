import { Controller } from '@nestjs/common';
import { NapService } from './nap.service';

@Controller('nap')
export class NapController {
  constructor(private readonly napService: NapService) {}
}
