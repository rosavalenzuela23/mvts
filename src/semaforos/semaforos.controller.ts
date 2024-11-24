import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Mapa } from 'src/model/Mapa';
import { Semaforo } from 'src/model/Semaforo';
import { SemaforosService } from './semaforos.service';

@Controller('semaforos')
export class SemaforosController {

    private mapa = Mapa.obtenerInstancia();

    constructor(
        private semaforosService: SemaforosService
    ) {
        console.log('semaforo')
    }

    @MessagePattern('semaforo.crear')
    crearSemaforo(@Payload() data: Semaforo) {
        this.mapa.agregarSemaforo(data);
    }

    @MessagePattern('semaforo.actualizar')
    actualizarEstadoSemaforo(@Payload() semaforo: Semaforo) {
        this.mapa.actualizarSemaforo(semaforo);
    }

    @MessagePattern('semaforo.cambiarEstado')
    cambiarEstadoSemaforo(@Payload() semaforo: Semaforo) {
        this.mapa.actualizarSemaforo(semaforo);
        this.semaforosService.cambiarEstadoSemaforo(semaforo.id, semaforo.estado);
    }

}
