import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleService } from './google/google.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, GoogleService],

})
export class AppModule {}
