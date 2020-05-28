import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import {OfertasService } from '../../services/ofertas.service';
import { EmpresaService} from '../../services/empresa.service';

import { AuthService } from '../../services/auth.service';
import {Router } from '@angular/router';

@Component({
  selector: 'app-oferta',
  templateUrl: './vistaEmpresa.component.html',
  styleUrls: ['./vistaEmpresa.component.css']
})
export class VistaEmpresaComponent {

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
              private router: Router,
              public auth: AuthService,  ) {

this.activatedRoute.params.subscribe( params => {
    this.oferta = this._ofertasService.getOferta(params.id);
  });
 }
 ngOnInit() {
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
}
