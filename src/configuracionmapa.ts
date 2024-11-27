import { readFileSync } from "fs"
import { Mapa } from "./model/Mapa";
import { Camino } from "./model/Camino";

const nombreArchivo = './posicionCaminos.json'

export function configurarMapa() {

    //agregar caminos
    const file = readFileSync(nombreArchivo);
    const json = JSON.parse(file.toString());
    for (const camino of json) {
        Mapa.obtenerInstancia().agregarCamino(Camino.construirConJson(camino));       
    }

    //se deja a consideracion futuras configuraciones

}