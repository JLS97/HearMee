import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ArtistaService } from 'src/app/services/artista.services';
import { OfertasService } from 'src/app/services/ofertas.service';
import { Router } from '@angular/router';

import { DataTableDirective } from 'angular-datatables';
import { formattedError } from '@angular/compiler';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Oferta } from 'src/app/models/oferta';
import { NgLocalization } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public ofertas = new Array();
  public artistas = new Array();
  constructor(
    public _artistaService: ArtistaService,
    public _ofertaService: OfertasService,
    private _empresaService: EmpresaService,
    private router: Router,
  ) {}

  ngOnInit() {

    if(this._empresaService.getIdentity().email =="empresa@empresa.com"){
      this.muestraOfertas();
    }else{
      this.router.navigate(['/home']);
    }

  }

  public muestraArtistas(){
    this._artistaService.artistasDashboard().subscribe(
      response =>{
        if(!Array.isArray(response) || response.length <= 0 || typeof response[0] != "object")
        return;
        let aux = response[0];
        response.forEach(element => {
          this.artistas.push(element);
        });
      },
      error => {

      }
    );
  }

  //TO-DO
  public eliminar(id){
    console.log(id);
  }
  public banear(id){
    console.log(id);
  }

  public muestraOfertas(){
    this._artistaService.ofertasDashboard().subscribe(
      response => {
        if(!Array.isArray(response) || response.length <= 0 || typeof response[0] != "object")
        return;
        var aux  = response[0];
        response.forEach(element => {
          this.ofertas.push(element);
        });
      },
      error => {

      }
    );
  }

  public gestionarartistas(){
    while(this.ofertas.length > 0)
      this.ofertas.pop(); 
    
      this.muestraArtistas();
  }
  public gestionarofertas(){
    while(this.artistas.length > 0)
      this.artistas.pop();

    this.muestraOfertas();
  }

  public aprobar(id){
    var oferta = new Oferta('','','','','',[],'','','','','',[],[],[],[],false,'','','');

    this._ofertaService.getOferta(id).subscribe(
      response => {
        console.log(response);
        oferta = response[0];
        console.log(oferta);
        oferta.aprobada = true;
        this._ofertaService.editar(id,oferta).subscribe(
          response => {
            //Aqui habria que recargar como sea
            location.reload();
          },
          error => {
            console.log(error);
          }
        );
      },
      errorr =>{ 
        console.log(errorr);
      }
    );
  }

  public desaprobar(id){
    var oferta = new Oferta('','','','','',[],'','','','','',[],[],[],[],false,'','','');

    this._ofertaService.getOferta(id).subscribe(
      response => {
        console.log(response);
        oferta = response[0];
        console.log(oferta);
        oferta.aprobada = false;
        this._ofertaService.editar(id,oferta).subscribe(
          response => {
            console.log(response);
            oferta = response[1];
            console.log(oferta);
            location.reload();
          },
          error => {
            console.log(error);
          }
        );
      },
      errorr =>{ 
        console.log(errorr);
      }
    );
  }

}
