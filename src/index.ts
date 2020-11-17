// Librerias
import Faker from 'faker';
import { ServicioDePaquetes } from './paquete/paquete.service';
import { Prioridad } from './paquete/paquete.entity';
//

(function setup() {
  Faker.locale = 'es';
  // Saludamos a la clase
  const myName = 'Rodrigo';
  console.log(`¡Hola! Me llamo ${myName}, y les voy a contar sobre TypeScript\n`);
})();

const getPaquetes = async (pagina = 1) => {
  const paquetes = await ServicioDePaquetes.getRepositorio({pagina, cantidad: 10});
  const listado = paquetes.respuesta.reduce((anterior, actual, indice) => `${anterior}\n${indice+1}- ${actual}`, '');
  console.log(`Se trajeron los siguientes paquetes: ${listado}\n`);
  return paquetes.respuesta;
};

Promise.all(
  [getPaquetes(), getPaquetes(2), getPaquetes(3)]
).then(
  (respuestas) => {
    console.log(`Se obtuvieron ${respuestas.length} respuestas correctas\n`);
    return respuestas;
  })
  .then(([r1, r2, r3]) => {
    const arrayPlano = [
      // La desestructuración nos permite descomponer el array en sus elementos componentes
      // De esta manera "fusionamos" los elementos de las 3 respuestas en un solo array nuevo
      ...r1,
      ...r2,
      ...r3,
    ];
    const soloLosPrioritarios = arrayPlano.filter(paquete => paquete.prioridad == Prioridad.EN24HORAS);
    console.log(`Existen ${soloLosPrioritarios.length} paquetes prioritarios: \n ${JSON.stringify(soloLosPrioritarios, null, 4)}`)
    return soloLosPrioritarios;
  })
  .catch(err => {
    console.error(err);
});

getPaquetes(0).then(() => {
  console.log('Vamos a tener error :(')
}).catch(err => console.log("ERROR!", err));




