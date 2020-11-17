export enum Prioridad {
  EN24HORAS = "24hs",
  MEDIA = "Media",
  BAJA = "Baja",
}

interface ParamsDeConstructor {
  prioridad?: Prioridad;
  shipper: string;
  id: number;
}

class Paquete {
  private _id: number;
  private _shipper = '';
  private _prioridad: Prioridad;

  constructor({id, shipper, prioridad = Prioridad.MEDIA}: ParamsDeConstructor) {
    this._id = id;
    this._shipper = shipper;
    this._prioridad = prioridad;
  }


  get id(): number {
    return this._id;
  }

  get shipper(): string {
    return this._shipper;
  }


  get prioridad(): Prioridad {
    return this._prioridad;
  }

  set prioridad(value: Prioridad) {
    this._prioridad = value;
  }

  toString(): string {
    return `Paquete numero ${this._id} de ${this._shipper}, con prioridad ${this._prioridad}`;
  }
}

export default Paquete;
