import * as amqp from 'amqplib/callback_api';
import { env } from 'process';
import { recibirMensajeSemaforos } from './semaforos';
import { channel } from 'diagnostics_channel';
import { recibirInformacionEstacionCentral } from './estacioncentral';
import { Mapa } from './model/Mapa';
import { recibirMensajeVehiculos } from './vehiculos';
import { configurarMapa } from './configuracionmapa';

require('dotenv').config();

const canales = new Map<string, amqp.Channel>();

configurarMapa(); //configurar el los caminos del mapa

amqp.connect(env.urlRabbit, (err0, connection) => {
    if (err0) throw err0;

    //escuchar por los semaforos
    connection.createChannel((err1, channel) => {
        if (err1) throw err1;

        channel.assertQueue(env.semaforos_queue, {
            durable: false,
            autoDelete: true
        });

        channel.consume(env.semaforos_queue, msg => recibirMensajeSemaforos(msg));
        canales.set(env.semaforos_queue, channel);
        //enviar actualizacion
        console.log('escuchando en %s', env.semaforos_queue);
    });

    //escuchar todo lo que llegue de la estacion central
    connection.createChannel((err1, channel) => {
        if (err1) throw err1;

        channel.assertQueue(env.estacioCentral_queue, {
            durable: false,
            autoDelete: true
        });

        channel.consume(env.estacioCentral_queue, msg => recibirInformacionEstacionCentral(msg));
        canales.set(env.estacioCentral_queue, channel);
        console.log('escuchando en %s', env.estacioCentral_queue)
    });


    //crear la conexion para escuchar toda la informacion que llegue de los vehiculos
    connection.createChannel((err1, channel) => {
        if (err1) throw err1;

        channel.assertQueue(env.vehiculos_queue, {
            durable: false
        });

        channel.consume(env.vehiculos_queue, msg => recibirMensajeVehiculos(msg));
        canales.set(env.vehiculos_queue, channel);
    })

    //canal para enviar mensajes a alguna cola dentro de la arquitectura del mvts
    connection.createChannel((err1, channel) => {
        if (err1) throw err1;
        canales.set(env.mapa_envio_a_colas, channel);
    })

})

setInterval(() => {
    console.log('INFORMACION MAPA-----');
    console.log(JSON.stringify(Mapa.obtenerInstancia()));
    console.log('FIN INFORMACION MAPA-----');
}, 5000);

export { canales };
