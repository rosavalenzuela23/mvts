import { Vehiculo } from "../model/Vehiculo"


export type MensajeVehiculo = {
    cmd: string,
    data: Vehiculo
}