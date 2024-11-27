import { Mapa } from "./Mapa";
import { Posicion } from "./Posicion";
import { Vehiculo } from "./Vehiculo";

export class Camino { 

    public vehiculos: Map<string, Vehiculo>;
    public posicionInicio: Posicion;
    public posicionFinal: Posicion;
    public nombre: string;
    public cantidadParaCongestion: number;
    public estaCongestionado: boolean;

    constructor(posicionInicio: Posicion, posicionFinal: Posicion) {
        this.vehiculos = new Map();
        this.posicionFinal = posicionFinal;
        this.posicionInicio = posicionInicio;
    }

    static construirConJson(json: any): Camino {
        const aux = new Camino(json.posicionInicio, json.posicionFinal);
        aux.nombre = json.nombre;
        return aux;
    }

    /**
     * Metodo que verifica si el vehiculo esta en las mismas coordenadas del camino y en caso de que
     * se cierto, lo agrega
     * @param vehiculo El Vehiculo a ser agregado
     * @returns true si el vehiculo se agrego al camino, false en caso contrario
     */
    agregarVehiculo(vehiculo: Vehiculo): boolean {

        const vposicion = vehiculo.posicion;

        if (!this.verificarPosicion(vposicion)) {
            return false;
        }
        
        this.vehiculos.set(vehiculo.identificador, vehiculo);
        
        if (this.vehiculos.size >= this.cantidadParaCongestion) {
            this.estaCongestionado = true;
        } else {
            this.estaCongestionado = false;
        }

        return true;
    }

    /**
     * Metodo para verificar si un punto esta dentro de una linea(dos puntos)
     * @param vpos punto a verificar dentro de los rangos
     * @returns true si el punto se encuentra dentro del rango, false en caso contrario
     */
    private verificarPosicion(vpos: Posicion): boolean {
        const posi = this.posicionInicio;
        const posf = this.posicionFinal;

        return (vpos.x >= posi.x && vpos.x <= posf.x && vpos.y >= posi.y && vpos.y <= posf.y)
    }

    /**
     * Verifica si el camino tiene dentro al vehiculo que se pasa como argumento
     * @param vehiculo vehiculo a verificar
     * @returns true si es que el camino si tiene guardado al vehiculo, false en caso contrario
     */
    contieneAlVehiculo(vehiculo: Vehiculo) {
        return this.vehiculos.get(vehiculo.identificador) !== undefined;
    }

    /**
     * Metodo que actualiza la posicion del vehiculo dentro del camino
     * y en caso de que el vehiculo ya no se encuentre dentro del camino,
     * lo cambia de camino.
     * @param vehiculo El vehiculo al cual se le actualizara la posicion
     */
    actualizarPosicionVehiculo(vehiculo: Vehiculo) {

        //verificar que siga en el camino
        if(!this.verificarPosicion(vehiculo.posicion)) {
            //quitarlo de este camino
            const mapaAux = new Map<string, Vehiculo>();
            for(const iVehiculo of this.vehiculos.values()) {
                if (iVehiculo.identificador === vehiculo.identificador) {
                    continue;
                }
                mapaAux.set(iVehiculo.identificador, iVehiculo);
                //Le quita la congestion al camino
                if (this.estaCongestionado && this.cantidadParaCongestion < this.vehiculos.size) {
                    this.estaCongestionado = false;
                }
            }
            this.vehiculos = mapaAux;
            //cambiarlo de camino
            Mapa.obtenerInstancia().agregarVehiculo(vehiculo);
            return;
        }

        this.vehiculos.set(vehiculo.identificador, vehiculo);
    }

    toJsonString(): any {
        const aux: any = {}
        aux['vehiculos'] = [];
        aux.posicionInicio = this.posicionInicio;
        aux.posicionFinal = this.posicionFinal;
        aux.nombre = this.nombre;

        for (const v of this.vehiculos.values()) {
            aux['vehiculos'].push(v);
        }

        return aux;
    }

}