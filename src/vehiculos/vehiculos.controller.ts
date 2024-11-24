import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EstacionCentralService } from 'src/estacion-central/estacion-central.service';
import { Mapa } from 'src/model/Mapa';
import { Vehiculo } from 'src/model/Vehiculo';

@Controller('vehiculos')
export class VehiculosController {

    private mapa: Mapa = Mapa.obtenerInstancia();

    constructor(
        private envioMvts: EstacionCentralService
    ){}

    @MessagePattern("vehiculo.crear")
    agregarVehiculo(@Payload() vehiculo: Vehiculo) {
        this.mapa.agregarVehiculo(vehiculo);
        this.actualizarMapa();
    }

    @MessagePattern("vehiculo.actualizar")
    actualizarVehiculo(@Payload() vehiculo: Vehiculo) {
        this.mapa.actualizarPosicionVehiculo(vehiculo);
        this.actualizarMapa();
    }

    private actualizarMapa() {
        this.envioMvts.enviarDatos(this.mapa);
    }

}
