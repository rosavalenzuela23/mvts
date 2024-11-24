import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ESTADOS_SEMAFORO } from 'src/model/ESTADOS_SEMAFORO';

@Injectable()
export class SemaforosService {

    constructor(
        @Inject('EstadosSemaforos') private envioEstados: ClientProxy
    ){}

    cambiarEstadoSemaforo(idSemaforo: string, estado: ESTADOS_SEMAFORO) {
        this.envioEstados.emit(idSemaforo, estado);
    }

}
