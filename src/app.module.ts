import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { CompanyModule } from './company/company.module';
import { MachinesModule } from './machines/machines.module';
import configuration from './config/configuration';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 8889,
      username: 'root',
      password: 'root',
      database: 'farm_service',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      bigNumberStrings: false,
      logging: true,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CompanyModule,
    MachinesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
