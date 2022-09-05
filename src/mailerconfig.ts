//TODO change transport on production

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export = {
  transport: 'smtp://FarmServiceM:123@localhost:2500',
  defaults: {
    from: 'no-reply@FarmServiceTM.com',
  },
  template: {
    dir: __dirname + '/templates/email',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
