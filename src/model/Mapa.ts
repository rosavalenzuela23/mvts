import { Camino } from "./Camino";
import { ESTADOS_SEMAFORO } from "./ESTADOS_SEMAFORO";
import { Semaforo } from "./Semaforo";
import { Vehiculo } from "./Vehiculo";

export class Mapa { 

    private semaforos: Map<string, Semaforo>;
    private caminos: Map<string, Camino>;

    private static instance: Mapa | undefined = undefined;

    private constructor() {
        this.semaforos = new Map();
        this.caminos = new Map();
    }

    static obtenerInstancia(): Mapa {
        if(Mapa.instance === undefined) {
            Mapa.instance = new Mapa();
        }
        return Mapa.instance;
    }

    agregarSemaforo(semaforo: Semaforo) {
        this.semaforos.set(semaforo.id, semaforo);
    }

    actualizarSemaforo(semaforo: Semaforo) {
        if (this.semaforos.get(semaforo.id) === undefined) {
            throw new Error('El semaforo no existe');
        }

        if (semaforo.estado === ESTADOS_SEMAFORO.VERDE) {
            semaforo.estado = ESTADOS_SEMAFORO.ROJO;
        } else {
            semaforo.estado = ESTADOS_SEMAFORO.VERDE;
        }

        this.semaforos.set(semaforo.id, semaforo);
    }

    agregarCamino(camino: Camino) {
        this.caminos.set(camino.nombre, camino);
    }

    actualizarPosicionVehiculo(v: Vehiculo){

        //verificar que siga dentro de las coordenadas del camino

        for(const camino of this.caminos.values()) {
            if (camino.contieneAlVehiculo(v)) {
                camino.actualizarPosicionVehiculo(v);
                return;
            }
        }

        //en caso de que no se encuentre en ningun camino, se va agregar en alguno
        this.agregarVehiculo(v);
    }

    agregarVehiculo(v: Vehiculo) {
        for (const camino of this.caminos.values()) {

            if (camino.agregarVehiculo(v)) {
                return;
            }

        }
    }

}