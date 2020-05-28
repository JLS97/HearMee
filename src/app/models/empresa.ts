export class Empresa{
    constructor(
        public _id: string,
        public email: string,
        public password: string,
        public nombre: string,
        public ciudad:string,
        public estilo: string,
        public fechaCreacion: string
    ){}
}