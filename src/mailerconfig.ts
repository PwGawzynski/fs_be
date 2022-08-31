//TODO change transport on production
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export = {
  transport: 'smtp://FarmServiceM:123@localhost:2500',
  defaults: {
    from: 'Registration@FarmServiceTM.com',
  },
  template: {
    dir: './templates/email',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
