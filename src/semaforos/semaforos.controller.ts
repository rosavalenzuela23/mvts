import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Mapa } from 'src/model/Mapa';
import { Semaforo } from 'src/model/Semaforo';
import { SemaforosService } from './semaforos.service';
import { ESTADOS_SEMAFORO } from 'src/model/ESTADOS_SEMAFORO';

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
        
        
        setInterval(() => {
            if (data.estado === ESTADOS_SEMAFORO.VERDE) {
                data.estado = ESTADOS_SEMAFORO.ROJO;
            } else {
                data.estado = ESTADOS_SEMAFORO.VERDE;
            }
            this.cambiarEstadoSemaforo(data);
        }, 2000)

    }

    @MessagePattern('semaforo.actualizar')
    actualizarEstadoSemaforo(@Payload() semaforo: Semaforo) {
        this.mapa.actualizarSemaforo(semaforo);
        console.log(this.mapa); 
    }

    @MessagePattern('semaforo.cambiarEstado')
    cambiarEstadoSemaforo(@Payload() semaforo: Semaforo) {
        this.mapa.actualizarSemaforo(semaforo);
        this.semaforosService.cambiarEstadoSemaforo(semaforo.id, semaforo.estado);
    }

}
