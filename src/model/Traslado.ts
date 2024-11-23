import { Carga } from "./Carga";
import { Lugar } from "./Lugar";

export class Traslado {
    public carga: Carga;
    public lugarInicio: Lugar;
    public lugarFinal: Lugar;
    public tiempo: number;
    public id: string;
}