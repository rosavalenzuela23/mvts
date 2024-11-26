import { readFileSync } from "fs"
import { Mapa } from "./model/Mapa";

const nombreArchivo = './posicionCaminos.json'

export function configurarMapa() {

    //agregar caminos
    const file = readFileSync(nombreArchivo);
    const json = JSON.parse(file.toString());
    for (const camino of json) {
        console.log(camino);
        Mapa.obtenerInstancia().agregarCamino(camino);       
    }

    //se deja a consideracion futuras configuraciones

}