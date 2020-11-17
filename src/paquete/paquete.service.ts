// Libs
import Faker from 'faker';
// Entidades
import Paquete, { Prioridad } from './paquete.entity';
import { Pagina, RespuestaDeServidor } from '../commons/interfacesWeb';

const generadorDePaquetes = function*(idInicial: number) {
  let id = idInicial;
  while (true) {
    const datosDelPaquete: any = {
      id,
      shipper: Faker.company.companyName()
    };

    // Completamente arbitrario
    if(id % 4 == 0) datosDelPaquete['prioridad'] = Prioridad.EN24HORAS;
    // Ambos metodos de acceso son validos
    else if (id % 10 == 0) datosDelPaquete.prioridad = Prioridad.BAJA;

    yield new Paquete(datosDelPaquete);
    id++;
  }
};

const idxDelPrimeroDeLaPagina = ({pagina, cantidad}: Pagina) => (pagina - 1) * cantidad;

class PaqueteService {
  private _todos: Paquete[] = [];
  private static maxDurationMS = 10000;

  // En JS/TS, el constructor es una función opcional
  // En caso de no estar presente, se declara implicitamente

  private generarDatos = (pagina: Pagina) => {
    const primerId = idxDelPrimeroDeLaPagina(pagina);
    if (primerId < 0) throw Error('Id Erroneo');
    const paquetesDeLaPagina = generadorDePaquetes(primerId);
    const paquetes =
      Array<Paquete|null>(pagina.cantidad) // Creamos un array vacio de tamaño = cantidad
        .fill(null) // Rellenamos con un valor cualquiera
        // Reemplazamos cada uno de los slots por un objeto Paquete generado
        .map(() => paquetesDeLaPagina.next().value);
    return paquetes;
  };

  getRepositorio = (data: Pagina): Promise<RespuestaDeServidor<Paquete>> => {
    console.log(`Se pidieron los datos de la pag. ${data.pagina} el ${new Date()}`);
    // "Promisificamos" la llamada al servicio
    const promesa = new Promise<RespuestaDeServidor<Paquete>>((resolve, reject) => {
      const respuesta = this.generarDatos(data);
      const valorADevolver: RespuestaDeServidor<Paquete> = { respuesta, estado: 'OK' };

      const duracionDeRespuestaRnd = Math.floor(PaqueteService.maxDurationMS * Math.random());

      setTimeout(() => {
        console.log(
          `Se devolvieron los datos de la pag. ${data.pagina} el ${new Date()}, con una demora estimada de ${duracionDeRespuestaRnd}ms`);
        if(respuesta && respuesta.length) {
          // Añadimos o "empujamos" al final del array de todos los paquetes, para memorizarlos
          this._todos.push(...respuesta);
          resolve(valorADevolver);
        } else {
          valorADevolver.estado = 'ERROR';
          reject(valorADevolver);
        }
      }, duracionDeRespuestaRnd);
    });
    return promesa;
  };
}

/*
* En los servicios, stores u otros objetos en los cuales nos importa mantener
* una única fuente de verdad usamos el patrón Singleton
*
* En este caso, se logra exportando una sola instancia y no la clase,
* pero también es común verlo implementado en el constructor
*/
export const ServicioDePaquetes = new PaqueteService();
