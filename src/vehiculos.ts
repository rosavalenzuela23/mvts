import { Message } from "amqplib";
import { MensajeVehiculo } from "./tipos/mensajeVehiculo";
import { Mapa } from "./model/Mapa";
import { actualizarEstacionCentral } from "./estacioncentral";

const mapa = Mapa.obtenerInstancia();

export function recibirMensajeVehiculos(msg: Message) {
    const jsonCommand: MensajeVehiculo = JSON.parse(msg.content.toString());

    if (jsonCommand.cmd === 'crear') {
        mapa.agregarVehiculo(jsonCommand.data)
    } else if (jsonCommand.cmd === 'actualizar') {
        mapa.actualizarPosicionVehiculo(jsonCommand.data);
    }

    actualizarEstacionCentral() //funcion foraneo
    console.log('Peticion realizada con exito');
    console.log(Mapa.obtenerInstancia().toJsonString())
}