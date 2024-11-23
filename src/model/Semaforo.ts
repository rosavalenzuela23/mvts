import { ESTADOS_SEMAFORO } from "./ESTADOS_SEMAFORO";

export class Semaforo{

    public id : string;
    public posicionx: number;
    public posiciony: number;
    public estado : ESTADOS_SEMAFORO;  

    constructor (id: string, posicionx: number, posiciony: number, estado: ESTADOS_SEMAFORO){
        this.id = id;
        this.posicionx = posicionx;
        this.posiciony = posiciony;
        this.estado = estado;
    }

    

}