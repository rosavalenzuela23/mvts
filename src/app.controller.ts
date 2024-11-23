import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(undefined)
  probarCola(@Payload() data) {
    console.log('SE RECIBIO UN MENSAJE SIN PATRON');
    console.log(data);
  }

}
