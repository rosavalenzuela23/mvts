import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SemaforosController } from './semaforos/semaforos.controller';

@Module({
  imports: [],
  controllers: [AppController, SemaforosController],
  providers: [AppService],
})
export class AppModule {}
