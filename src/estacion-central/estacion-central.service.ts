import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Mapa } from 'src/model/Mapa';

@Injectable()
export class EstacionCentralService {

    constructor(
        @Inject('ActualizarMapa') private rmq: ClientProxy
    ){}

    enviarDatos(datos: Mapa) {
        this.rmq.emit('actualizar_mapa', datos);
    }

}
