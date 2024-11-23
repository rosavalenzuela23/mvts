import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Mapa } from 'src/model/Mapa';
import { Semaforo } from 'src/model/Semaforo';

@Controller('semaforos')
export class SemaforosController {

    private mapa = Mapa.obtenerInstancia();

    constructor() {
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

}
