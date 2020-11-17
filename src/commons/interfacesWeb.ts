export interface Pagina {
  pagina: number;
  cantidad: number;
}

export interface RespuestaDeServidor<T> {
  estado: 'OK' | 'ERROR'; // No solamente declaramos que es un string, sino _cuales_ son los valores que puede tener
  respuesta: T[]; // Hacemos generica a la interfaz, devolviendo un array tipado
}
