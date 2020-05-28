import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicosService {

  private musicos: any[] = [
{
  nombre: 'Mario Moya',
  estilo: 'Pop, Rock y Blues',
  instrumentos: 'Guitarra y piano',
  img: 'assets/images/musica.jpg',
  f_ini: '2019/10/24',
  localidad: 'Villajoyosa'
},

{
    nombre: 'Mario Moya',
    estilo: 'Pop, Rock y Blues',
    instrumentos: 'Guitarra y piano',
    img: 'assets/images/musica.jpg',
    f_ini: '2019/10/24',
    localidad: 'Villajoyosa'
},

{
    nombre: 'Mario Moya',
    estilo: 'Pop, Rock y Blues',
    instrumentos: 'Guitarra y piano',
    img: 'assets/images/musica.jpg',
    f_ini: '2019/10/24',
    localidad: 'Villajoyosa'
}

  ];

  constructor() {
  }

  getMusicos(): Musico[] {
  return this.musicos;
  }

  getMusico(idx: string) {
  return this.musicos[idx];
  }

  buscarMusicos(termino: string) {
    const musicosArr: Musico[] = [];
    termino = termino.toLowerCase();

    for (const musico of this.musicos) {
      const nombre = musico.nombre.toLowerCase();
      if (nombre.indexOf(termino) >= 0) {
        musicosArr.push(musico);
      }
      const estilo = musico.estilo.toLowerCase();
      if (estilo.indexOf(termino) >= 0) {
        musicosArr.push(musico);
      }
    }
    return musicosArr;
  }
}

export interface Musico {
nombre: string;
estilo: string;
instrumentos: string;
valoracion: string;
img: string;
f_ini: Date;
}
