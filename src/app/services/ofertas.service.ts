import { Injectable } from '@angular/core';
import { map } from 'rxjs/Operators';
import { Observable } from 'rxjs/Observable';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {
  public url: string;
  
  private ofertas: any[] = [
{
  empresa:'Pub Irish',
  titulo: 'Música reggae/pop, febrero',
  desc: 'Oferta en hotel cerca de la playa del paraíso, en Villajoyosa.',
  img: 'assets/images/hotel1.jpg',
 f_ini:  '14/10/2019',
  tipo: 'oferta',
  localidad: 'Villajoyosa',
  estilo: 'Pop'
},

{
  empresa:'La caleta',
  titulo: 'Oferta en la Cala de Fienestrat',
  desc: 'Oferta en bar cerca de la playa de la Cala, en Finestrat. Se busca música tranquila y contrato a largo plazo.',
  img: 'assets/images/bar1.jpg',
  f_ini:  '14/10/2019',
  tipo: 'oferta',
  localidad: 'Finestrat',
  estilo: 'Pop'
},

{
  empresa:'La revuelta',
  titulo: 'Buscamos guitarrista',
  desc: 'Nos falta un guitarrista para formar una banda de rock indie. Somos un grupo joven en busca de eventos.',
  img: 'assets/images/hotel3.jpg',
  f_ini:  '14/10/2019',
  tipo: 'banda',
  localidad: 'Alicante',
  estilo: 'Pop'
},
{
  empresa:'Entreamigos',
  titulo: 'Bodas en hotel, Alicante',
  desc: 'Se busca música relax/R&B para contratar en bodas y eventos. Cerca de la playa de San Juan.',
  img: 'assets/images/teatro1.jpg',
  f_ini:  '14/10/2019',
  tipo: 'oferta',
  localidad: 'San Juan',
  estilo: 'Pop'
},

{
  empresa:'Cala Finestrat',
  titulo: 'Hotel 2',
  desc: 'Oferta en hotel cerca de la playa de la Cala, en Finestrat.',
  img: 'assets/images/rest1.jpg',
  f_ini:  '14/10/2019',
  tipo: 'oferta',
  localidad: 'Finestrat',
  estilo: 'Pop'
},

{
  empresa:'Pub Magic',
  titulo: 'Se busca cantante',
  // tslint:disable-next-line: max-line-length
  desc: 'Nuestro cantante estrella ha tenido un problema para este mes y no podrá asistir a nuestros bolos. Necesitamos un cantante para tres eventos.',
  img: 'assets/images/fiest1.jpg',
  f_ini:  '14/10/2019',
  tipo: 'banda',
  localidad: 'Campello',
  estilo: 'Pop'
}/*,
{
  titulo: 'Falta bajista',
  desc: 'Buscamos un bajista con minimo 3 años de experiencia para un evento especial este fin de semana.',
  img: 'assets/images/band1.jpg',
  f_ini: '2019/10/24',
  tipo: 'banda',
  localidad: 'Villajoyosa'
},
{
  titulo: 'Oferta en local de lujo',
  desc: 'Se busca orquesta/banda de música clásica para eventos de alto cache.',
  img: 'assets/images/orq.jpg',
  f_ini: '2019/10/04',
  tipo: 'oferta',
  localidad: 'Valencia'
}*/
  ];

  constructor(private _http: HttpClient) {
      this.url = GLOBAL.url;
  }

  getOfertas(): Oferta[] {
  return this.ofertas;
  }
  getImagen(){
    return this.ofertas;
  }

  preseleccionar(idOferta,token,idArtista){
    let headers = new HttpHeaders({'Content-Type':'application/JSON'});

    let json = JSON.stringify(token);
    let params = json;

    return  this._http.put(this.url+'ofertas/preseleccionar/'+idOferta+'/'+idArtista,{headers : headers}).pipe(map((res:Response) => res));
}

seleccionarDefinitivamente(idOferta,idArtista){
  let headers = new HttpHeaders({'Content-Type':'application/JSON'});

  return  this._http.put(this.url+'ofertas/seleccionDefinitiva/'+idOferta+'/'+idArtista,{headers : headers}).pipe(map((res:Response) => res));
}

borrarSolicitante(idOferta,token,idArtista){
  let headers = new HttpHeaders({'Content-Type':'application/JSON'});

  let json = JSON.stringify(token);
  let params = json;

  return  this._http.put(this.url+'ofertas/borrarSolicitante/'+idOferta+'/'+idArtista,{headers : headers}).pipe(map((res:Response) => res));
}


borrarPreseleccion(idOferta,token,idArtista){
  let headers = new HttpHeaders({'Content-Type':'application/JSON'});

  let json = JSON.stringify(token);
  let params = json;

  return  this._http.put(this.url+'ofertas/borrarPreseleccionados/'+idOferta+'/'+idArtista,{headers : headers}).pipe(map((res:Response) => res));
}


borrarDescartados(idOferta,token,idArtista){
  let headers = new HttpHeaders({'Content-Type':'application/JSON'});

  let json = JSON.stringify(token);
  let params = json;

  return  this._http.put(this.url+'ofertas/borrarDescartados/'+idOferta+'/'+idArtista,{headers : headers}).pipe(map((res:Response) => res));
}

descartar(idOferta,token,idArtista){
    let headers = new HttpHeaders({'Content-Type':'application/JSON'});

    let json = JSON.stringify(token);
    let params = json;

    return  this._http.put(this.url+'ofertas/descartar/'+idOferta+'/'+idArtista,{headers : headers}).pipe(map((res:Response) => res));
}

  getOferta(id: string) {
    let headers = new HttpHeaders({'Content-Type':'application/JSON'});

    return this._http.get(this.url+'ofertas/id/'+id,{headers:headers}).pipe(map((res:Response) =>  res));
  }

  delete(id: string){
    let headers = new HttpHeaders({'Content-Type':'application/JSON'});

    return this._http.delete(this.url+'ofertas/'+id,{headers: headers}).pipe(map((res:Response) => res));
  }

  editar(id: string,par){
    let headers = new HttpHeaders({'Content-Type':'application/JSON'});
    let json = JSON.stringify(par);
    let params = json;
    return this._http.put(this.url+'ofertas/'+id,params,{headers: headers}).pipe(map((res:Response) => res));
  }

  buscarOfertas(termino: string) {
    const ofertasArr: Oferta[] = [];
    termino = termino.toLowerCase();

    for (const oferta of this.ofertas) {
      const titulo = oferta.titulo.toLowerCase();
      if (titulo.indexOf(termino) >= 0) {
        ofertasArr.push(oferta);
      }
      const desc = oferta.desc.toLowerCase();
      if (desc.indexOf(termino) >= 0) {
        ofertasArr.push(oferta);
      }
    }
    return ofertasArr;
  }
}

export interface Oferta { 
empresa:string;
titulo: string;
desc: string;
img: string;
f_ini: Date;
tipo: string;
localidad: string;
estilo: string;
}