import { Message } from "amqplib";
import { Semaforo } from "./model/Semaforo";
import { Mapa } from "./model/Mapa";
import { canales } from "./main";
import { env } from "process";

const mapa = Mapa.obtenerInstancia();

export function recibirInformacionEstacionCentral(msg: Message) {
    let semaforo: Semaforo;
    try {
        semaforo = JSON.parse(msg.content.toString());
    } catch (err) {
        console.log(err);
        return;
    }

    Mapa.obtenerInstancia().actualizarSemaforo(semaforo);

    canales.get(env.mapa_envio_a_colas)
    .sendToQueue(semaforo.id, Buffer.from(JSON.stringify(semaforo)));

    console.log('Actualizacion completa!');
}

export function actualizarEstacionCentral() {
    const canalEnvio = canales.get(env.mapa_envio_a_colas);

    canalEnvio.assertQueue(env.estacionCentral_get_queue, {
        durable: false
    })
    canalEnvio.sendToQueue(env.estacionCentral_get_queue, Buffer.from(JSON.stringify(mapa)));
}