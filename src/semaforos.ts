import * as amqp from 'amqplib/callback_api'
import { Mapa } from './model/Mapa';
import { MensajeSemaforo } from './tipos/mensajeSemaforo';
import { actualizarEstacionCentral } from './estacioncentral';

const mapa = Mapa.obtenerInstancia();

export function recibirMensajeSemaforos(msg: amqp.Message) {
    //no hay tiempo de hacer pipes

    let jsonMsg: MensajeSemaforo;

    try {
        jsonMsg = JSON.parse(msg.content.toString());
    } catch (err) {
        console.log(err);
        return;
    }

    if (jsonMsg.cmd == 'crear') {
        mapa.agregarSemaforo(jsonMsg.data);
    } else if (jsonMsg.cmd == 'actualizar') {
        mapa.actualizarSemaforo(jsonMsg.data);
    }

    actualizarEstacionCentral(); //funcion foraneo
    console.log('Peticion realizada con exito! %s', JSON.stringify(jsonMsg.data));
}
