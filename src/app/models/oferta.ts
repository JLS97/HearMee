export class Oferta {
  constructor(
      // tslint:disable-next-line: variable-name
      public _id: string,
      public foto: string,
      public sueldo: string,
      public ciudad: string,
      public creador: string,
      public estilo: string[],
      public titulo: string,
      public fechaInicio: string,
      public fechaEvento: string,
      public fechaFin: string,
      public estado: string,
      public solicitantes: [],
      public preseleccionados: [],
      public descartados: [],
      public instrumentos: string[],
      public aprobada: boolean,
      public descripcion: string,
      public seleccionado: string,
      public estado2: string,
     /* public inscripciones: number*/
  ) {
    /*inscripciones=solicitantes.length+ preseleccionados.length+descartados.length;*/
  }
}
