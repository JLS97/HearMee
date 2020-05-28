import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import {OfertasService } from '../../services/ofertas.service';
import { EmpresaService} from '../../services/empresa.service';

import { AuthService } from '../../services/auth.service';
import {Router } from '@angular/router';
import { ArtistaService } from 'src/app/services/artista.services';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { Artista } from 'src/app/models/artista';

@Component({
  selector: 'app-oferta',
  templateUrl: './oferta.component.html',
  styleUrls: ['./oferta.component.css']
})
export class OfertaComponent {

  oferta: any = {};
  empresa: any = {};
  empresas: any[] = [];
  musicos: any[]= [];
  termino: string;
  public identity;
  public artista = new Artista('','','','','','',[],'', [], []);

  constructor(private activatedRoute: ActivatedRoute,
              // tslint:disable-next-line: variable-name
              private _ofertasService: OfertasService,
              private _empresasService: EmpresaService,
              private _artistaService: ArtistaService,
              private _busquedaService: BusquedaService,
              
              private router: Router,
              public auth: AuthService,  ) {

/*this.activatedRoute.params.subscribe( params => {
    this.oferta = this._ofertasService.getOferta(params.id);
  });*/
 }
 ngOnInit() {
  this.getOferta();
  this.identity = localStorage.getItem('identity');
  this.artista = this._artistaService.getIdentity();
}

  buscarOferta(termino: string) {
    this.router.navigate( ['/buscar', termino] );
  }
  buscarMusico(termino: string){
    this.router.navigate(['/buscar', termino]);
  }

  verOferta(idx: number) {
    this.router.navigate(['/oferta', idx] );
  }
  verEmpresa(termino:string) {
    this.router.navigate(['/empresa', termino] );
  }
  getOferta() {
    this.activatedRoute.params.forEach(params => {
      let id = params['id'];
      this._ofertasService.getOferta(id).subscribe(
        response => {
            if (!response) {
              this.router.navigate(['/']);
            } else {
              if (Array.isArray(response) && response.length > 0)
                this.oferta = response[0];
            }
        }, error => {
          console.log(<any> error);
        }
      );
    });
  }

  
  public solicitarOferta(idOferta){
    
    if(this.identity){
      this._busquedaService.solicitar(idOferta,this._artistaService.getToken(),this.artista._id).subscribe(
        response => {
          if(this.artista.solicitadas.includes(idOferta)){
          }else{
          this.artista.solicitadas.push(idOferta);
          this._artistaService.editar(this.artista._id,idOferta).subscribe(
            response => {
            },
            error => {
              console.log(error);
            }
          );
          }
        },
        error =>{
  
        }
      );
    }
  }
}
