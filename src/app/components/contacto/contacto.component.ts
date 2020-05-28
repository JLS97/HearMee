import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import {OfertasService } from '../../services/ofertas.service';

import { AuthService } from '../../services/auth.service';
import {Router } from '@angular/router';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styles: []
})
export class ContactoComponent {

  oferta: any = {};
  ofertas: any[] = [];
  musicos: any[]= [];
    termino: string;

  constructor(private activatedRoute: ActivatedRoute,
              // tslint:disable-next-line: variable-name
              private _ofertasService: OfertasService,
              private router: Router,
              public auth: AuthService,  ) {

this.activatedRoute.params.subscribe( params => {
    this.oferta = this._ofertasService.getOferta(params.id);
  });
 }
 ngOnInit() {
    this.ofertas = this._ofertasService.getOfertas();
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
  
  }