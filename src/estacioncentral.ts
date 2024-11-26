import { Message } from "amqplib";
import { Semaforo } from "./model/Semaforo";
import { Mapa } from "./model/Mapa";
import { canales } from "./main";
import { env } from "process";
import { MensajeSemaforo } from "./tipos/mensajeSemaforo";

const mapa = Mapa.obtenerInstancia();

export function recibirInformacionEstacionCentral(msg: Message) {
    let semaforo: MensajeSemaforo;
    try {
        semaforo = JSON.parse(msg.content.toString());
    } catch (err) {
        console.log(err);
        return;
    }

    if (semaforo.cmd !== 'obtenerMapa') {
        Mapa.obtenerInstancia().actualizarSemaforo(semaforo.data);
        canales.get(env.mapa_envio_a_colas)
            .sendToQueue(semaforo.data.id, Buffer.from(JSON.stringify(semaforo.data)));
        console.log('Actualizacion completa!');
    }

    actualizarEstacionCentral();
}

export function actualizarEstacionCentral() {
    const canalEnvio = canales.get(env.mapa_envio_a_colas);

    canalEnvio.assertQueue(env.estacionCentral_get_queue, {
        durable: true
    })
    canalEnvio.sendToQueue(env.estacionCentral_get_queue, Buffer.from(mapa.toJsonString()));
}