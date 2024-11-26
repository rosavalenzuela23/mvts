import * as amqp from 'amqplib/callback_api'
import { Mapa } from './model/Mapa';
import { MensajeSemaforo } from './tipos/mensajeSemaforo';
import { canales } from './main';
import { env } from 'process';
import { Channel } from 'amqplib';

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

    actualizarEstacionCentral();
    console.log('Peticion realizada con exito! %s', JSON.stringify(jsonMsg.data));
}

function actualizarEstacionCentral() {
    //obtener el canal para enviar datos
    const canal: amqp.Channel = canales.get(env.mapa_envio_a_colas);
    canal.assertQueue(env.estacionCentral_get_queue, {
        durable: false
    })
    canal.sendToQueue(env.estacionCentral_get_queue, Buffer.from(JSON.stringify(mapa)));
}