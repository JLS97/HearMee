
import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfertasService } from '../../../services/ofertas.service';

import { ArtistaService } from '../../../services/artista.services';
import { EmpresaService } from '../../../services/empresa.service';
import { NgLocalization } from '@angular/common';

import { Oferta } from 'src/app/models/oferta';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { ɵInternalFormsSharedModule } from '@angular/forms';


@Component({
  selector: 'app-mis-ofertas',
  templateUrl: './mis-ofertas.component.html',
  
  styleUrls: ['./mis-ofertas.component.css']
})
export class MisOfertasComponent implements OnInit {

  public usuario;
  public empresa;
  public ofertas = new Array();
  public me_quiere: boolean = false;
  public itemCancelar;
  public indiceCancelar;
  public itemCancelarNombre;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private _artistaService: ArtistaService,
      private _empresaService: EmpresaService,
      private _ofertasService: OfertasService
    )
    {
      this.activatedRoute.params.subscribe( params => {
      this.usuario = this._artistaService.getIdentity();
      });
      this.empresa = this._empresaService.getIdentity();
    }

  ngOnInit() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search:true,
      paging:true,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_  elementos",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };

    this.muestraOfertas();
    

    console.log("Perfil Usuario");
    if(this.empresa != null){
      location.href = "/empresa";
    }
    else if(this.usuario == null){
      location.href = "/home";
    }
  }

  muestraOfertas(){
    this._artistaService.getArtista(this.usuario._id).subscribe(
      response => {
        console.log(response);
        var aux = new Array();
        aux = response[0].solicitadas;
        var ofertasAux = new Array();
        aux.forEach(element => {
          this._ofertasService.getOferta(element).subscribe(
            response =>{
              ofertasAux.push(response[0]);
            },
            error =>{

            }
          );
        });
        this.ofertas = ofertasAux;
        this.dtTrigger.next();
      },
      error => {

      }
    );
  }

  verEmpresa(idx: number) {
    this.router.navigate(['/empresa', idx] );
    console.log('Te estas metiendo a:', idx);
  }

  //TO-DO
  verOferta(idx: number) {
    this.router.navigate(['/oferta', idx] );
  }

  public precancelar(item,indice,nombre){
    this.itemCancelar = item;
    this.indiceCancelar = indice;
    this.itemCancelarNombre = nombre;
  }

  public cancelarSolicitud(){
    console.log(this.ofertas[this.indiceCancelar]);
    this.ofertas.splice(this.indiceCancelar,1);
    this.usuario.solicitadas = this.ofertas;

    let item = this.itemCancelar;

    for(var i = 0;i<item.solicitantes.length;i++){
      if(item.solicitantes[i]==this.usuario._id){
        item.solicitantes.splice(i,1);
      }
    }

    for(var x =  0;x<item.solicitantes.length;x++){
      if(item.solicitantes[x]==this.usuario._id){
        item.solicitantes.splice(x,1);
      }
    }

    for(var p = 0;p<item.solicitantes.length;p++){
      if(item.solicitantes[p]==this.usuario._id){
        item.solicitantes.splice(p,1);
      }
    }

    console.log(item);
    console.log(item._id);

    this._artistaService.deleteSolicitada(this.usuario._id,item._id).subscribe(
      response =>{
        this._ofertasService.borrarDescartados(item._id,'',this.usuario._id).subscribe(
          response =>{
            console.log(response);
          },
          error =>{
            console.log(error);
          }
        );
        this._ofertasService.borrarPreseleccion(item._id,'',this.usuario._id).subscribe(
          response=>{
            console.log(response);
          }
        );
        this._ofertasService.borrarSolicitante(item._id,'',this.usuario._id).subscribe(
          response=>{
            console.log(response);
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  }


  public aceptado(oferta){
    if(oferta.seleccionado == this.usuario._id){
      return true;
    }
    else {
      return false;
    }
  }

  public asignada(oferta){
    if(oferta.estado2=="Asignada"){
      return true;
    }
    else {
      return false;
    }
  }

  public aceptarOferta(oferta,indice){
    /*if(oferta._id!=null){
      this.usuario.aceptadas.push(oferta._id);
      this._artistaService.confirmado(this.usuario,this.empresa.email).subscribe(
        response => { 
          console.log(response);
         }
      );
      oferta.estado2 = "Finalizada";
      //this.usuario.solicitadas.push(oferta._id);
      this._artistaService.update(this.usuario._id,this.usuario).subscribe(
        response => {
          console.log(response);
          this._artistaService.confirmado(this.usuario,this.empresa.email).subscribe(
            response => { 
              console.log(response);
             }
          );
        },
        error => {
          console.log(error);
        }
      );
    }*/

    console.log(this.usuario);
    console.log(oferta.creador);
    this._empresaService.getEmpresa(oferta.creador).subscribe(
      response => {
        this.empresa = response [0];
        this.usuario.aceptadas.push(oferta._id);
        this.usuario.solicitadas.splice(indice,1);
        oferta.estado2 = "Asignada";
        this._ofertasService.editar(oferta._id,oferta).subscribe();
        this._artistaService.editar(this.usuario._id,this.usuario).subscribe(
          response => {
            console.log(response);
          },
          error => {
            console.log(error);
          }
        );
        this._artistaService.confirmado(this.usuario,this.empresa.email).subscribe();
      },
      error => {
        console.log(error);
      }
    );
  }

  public rechazarOferta(oferta,indice){
    //TO-DO
    oferta.seleccionado = '';

    this._ofertasService.editar(oferta._id,oferta).subscribe(
      response => {
        console.log(response);
        this.precancelar(oferta,indice,oferta.titulo);
        this.cancelarSolicitud();
      },
      error =>{
        console.log(error);
      }
    );
  }

  public detalleOferta(id){
    console.log(id);
    this.router.navigate(['/gestionOferta/'+id],id);
  }

  public eliminar(borraID){
    this._ofertasService.delete(borraID).subscribe(
      response => {
        location.reload();
      },
      error =>{
        console.log(error);
      }
    );
  }
}

