import * as amqp from 'amqplib/callback_api';
import { env } from 'process';
import { recibirMensajeSemaforos } from './semaforos';
import { channel } from 'diagnostics_channel';
import { actualizarEstacionCentral, recibirInformacionEstacionCentral } from './estacioncentral';
import { Mapa } from './model/Mapa';
import { recibirMensajeVehiculos } from './vehiculos';
import { configurarMapa } from './configuracionmapa';
import * as fs from 'fs';

require('dotenv').config();

const canales = new Map<string, amqp.Channel>();

configurarMapa(); //configurar el los caminos del mapa

const conf = {
    cert: fs.readFileSync('./llaves/client_natsu_certificate.pem'),
    key: fs.readFileSync('./llaves/client_natsu_key.pem'),
    passphrase: 'hola123',
    ca: [fs.readFileSync('./llaves/ca_certificate.pem')]
}

amqp.connect(env.urlRabbit, conf, (err0, connection) => {
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
            durable: false,
            autoDelete: true
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
    console.log(Mapa.obtenerInstancia().toJsonString());
    console.log('FIN INFORMACION MAPA-----');
}, 5000);

export { canales };
