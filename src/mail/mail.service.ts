import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}
  async sendMail(to: string, subject: string, html: string): Promise<any> {
    await this.mailService.sendMail({
      to,
      subject,
      html,
    });
  }
}
