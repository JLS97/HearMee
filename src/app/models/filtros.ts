export class Filtros {
    constructor(
        public sueldoMin: string,
        public sueldoMax: string,
        public localidades: string[],
        public instrumentos: string[],
        public estilos: string[],
        public tipoBusqueda: string,
        public nombreArtista: string,
        public tituloOferta: string
/*
fechas
*/
    ) {}
}
