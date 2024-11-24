import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SemaforosController } from './semaforos/semaforos.controller';
import { VehiculosController } from './vehiculos/vehiculos.controller';
import { EstacionCentralService } from './estacion-central/estacion-central.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'ActualizarMapa',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'EstacionCentral_queue',
        queueOptions: {
          durable: false
        }
      }
    },
    {
      name: 'EststadosSemaforos',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: ''
      }
    }
  ])],
  controllers: [AppController, SemaforosController, VehiculosController],
  providers: [AppService, EstacionCentralService],
})
export class AppModule { }