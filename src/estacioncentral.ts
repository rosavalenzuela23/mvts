import { Message } from "amqplib";
import { Semaforo } from "./model/Semaforo";
import { Mapa } from "./model/Mapa";


export function recibirInformacionEstacionCentral(msg: Message) {
    let jsonMsg: Semaforo;
    try {
        jsonMsg = JSON.parse(msg.content.toString());
    } catch (err) {
        console.log(err);
        return;
    }

    Mapa.obtenerInstancia().actualizarSemaforo(jsonMsg);

    console.log('Actualizacion completa!');
}