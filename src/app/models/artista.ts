export class Artista {
  constructor(
      // tslint:disable-next-line: variable-name
      public _id: string,
      public nombre: string,
      public email: string,
      public password: string,
      public ciudad: string,
      public estilo: string,
      public instrumentos: string[],
      public foto: string,
      public solicitadas: string[],
      public aceptadas: string[],
  ) { }
}
