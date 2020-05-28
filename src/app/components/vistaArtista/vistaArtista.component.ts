import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import {OfertasService } from '../../services/ofertas.service';
import { EmpresaService} from '../../services/empresa.service';
import { ArtistaService} from '../../services/artista.services';

import { AuthService } from '../../services/auth.service';
import {Router } from '@angular/router';
import { Artista } from 'src/app/models/artista';

@Component({
  selector: 'app-oferta',
  templateUrl: './vistaArtista.component.html',
  styleUrls: ['./vistaArtista.component.css']
})
export class VistaArtistaComponent {

  public artista: any = {};
  oferta: any = {};
  empresa: any = {};
  ofertas: any[] = [];
  empresas: any[] = [];
  musicos: any[]= [];
    termino: string;

  constructor(private activatedRoute: ActivatedRoute,
              // tslint:disable-next-line: variable-name
              private _ofertasService: OfertasService,
              private _empresasService: EmpresaService,
              private _artistasService: ArtistaService,
              private router: Router,
              public auth: AuthService,  ) {

 }
  ngOnInit() {
    this.getArtista();
    this.ofertas = this._ofertasService.getOfertas();
    console.log(this.ofertas);
  }

  buscarOferta(termino: string) {
    console.log(termino);
    this.router.navigate( ['/buscar', termino] );
  }
  buscarMusico(termino: string){
    console.log(termino);
    this.router.navigate(['/buscar', termino]);
  }

  verOferta(idx: number) {
    this.router.navigate(['/oferta', idx] );
    console.log('Te estas metiendo a:', idx);
  }
  verEmpresa(termino:string) {
    this.router.navigate(['/empresa', termino] );
    console.log(termino);
  }

  getArtista() {
    this.activatedRoute.params.forEach(params => {
      let id = params['id'];
      
      this._artistasService.getArtista(id).subscribe(
        response => {
          console.log(response);
            if (!response) {
              //this.router.navigate(['/']);
            } else {
              if (Array.isArray(response) && response.length > 0)
                this.artista = response[0];
            }
        }, error => {
          console.log(<any> error);
        }
      );
    });
  }
}
