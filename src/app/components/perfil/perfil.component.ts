import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfertasService } from '../../services/ofertas.service';
import { BusquedaService } from '../../services/busqueda.service';
import { Subject, concat, of, Observable } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap, delay } from 'rxjs/operators';

import { ArtistaService } from '../../services/artista.services';
import { EmpresaService } from '../../services/empresa.service';
import { NgLocalization } from '@angular/common';

import Localidades  from  'src/assets/localidadesNombres.json';
import EstilosMusicales  from  'src/assets/estilos_musicales.json';
import Instrumentos from 'src/assets/instrumentos.json';

import { Oferta } from 'src/app/models/oferta';
import { DataTableDirective } from 'angular-datatables';
import { Artista } from 'src/app/models/artista';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  public usuario: Artista;
  public empresa;
  public ofertas: Oferta[] = [];

  public artistaEditar: Artista;

  public id;

  dtOptionsOfertas: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  public localidadesAll = Localidades;
  public estilosMusicalesAll = EstilosMusicales;
  public instrumentosAll = Instrumentos;

  localidadesObs: Observable<string[]>;
  localidadesInput = new Subject<string>();
  localidadesLoading = false;

  estilosMusicalesObs: Observable<string[]>;
  estilosMusicalesLoading = false;
  estilosMusicalesInput = new Subject<string>();

  instrumentosObs: Observable<string[]>;
  instrumentosInput = new Subject<string>();
  instrumentosLoading = false;
  
  public me_quiere: boolean = false;
  public itemCancelar;
  public indiceCancelar;
  public itemCancelarNombre;

  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private _artistaService: ArtistaService,
      private _empresaService: EmpresaService,
      private _ofertasService: OfertasService,
      private _busquedaService: BusquedaService
    )
    {
      
      this.activatedRoute.params.subscribe( params => {
      this.usuario = this._artistaService.getIdentity();
      });
      this.empresa = this._empresaService.getIdentity();

      this.artistaEditar = new Artista('','','','','','', [],'', [], []);


      this.id = this._artistaService.getIdentity()._id;
    }

  ngOnInit() {
    this.loadLocalidades();
    this.loadEstilosMusicales();
    this.loadInstrumentos();
    
    this.dtOptionsOfertas = {
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

    this._artistaService.getArtista(this.id).subscribe(
      response =>{
        this.usuario = response[0];
        this.artistaEditar = this.usuario;
        this._busquedaService.buscarOfertasPorIds(this.usuario.solicitadas).subscribe(
          response => {
            if (response != null) {
              if (Array.isArray(response)) {
                this.ofertas = response;
              } else {
                this.ofertas = response["ofertas"];
              }
              this.dtTrigger.next();
            } 
          },
          error => {
          }
        );
        
      },
      error => {
        console.log(error);
      }
    );

    if(this.empresa != null){
      location.href = "/empresa";
    }
    else if(this.usuario == null){
      location.href = "/home";
    }

  }

  public editarPerfil(){
    this.usuario = this.artistaEditar;
    this._artistaService.update(this.usuario._id,this.artistaEditar).subscribe(
      response => {
        location.reload();
      },
      error => {
        console.log(error);
      }
    );
  }

  muestraOfertas(){
    this._artistaService.getArtista(this.usuario._id).subscribe(
      response => {
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
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  verEmpresa(idx: number) {
    this.router.navigate(['/empresa', idx] );
  }

  verOferta(idx: number) {
    this.router.navigate(['/oferta', idx] );
  }

  public detalleOferta(id){
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
  public recargar(){
    location.reload();
  }

  private loadEstilosMusicales() {
    this.estilosMusicalesObs = concat(
        of([]), // default items
        this.estilosMusicalesInput.pipe(
            distinctUntilChanged(),
            tap(() => this.estilosMusicalesLoading = true),
            switchMap(term => this.getEstiloMusical(term).pipe(
                catchError(() => of([])), // empty list on error
                tap(() => this.estilosMusicalesLoading = false)
            ))
        )
    );
  }
  private getEstiloMusical(term: string = null): Observable<string[]> {
    let items = this.estilosMusicalesAll;
    if (term) {
        items = items.filter(x => x.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return of(items).pipe(delay(500));
  }
  
  private loadInstrumentos() {
    this.instrumentosObs = concat(
        of([]), // default items
        this.instrumentosInput.pipe(
            distinctUntilChanged(),
            tap(() => this.instrumentosLoading = true),
            switchMap(term => this.getInstrumento(term).pipe(
                catchError(() => of([])), // empty list on error
                tap(() => this.instrumentosLoading = false)
            ))
        )
    );
  }
  private getInstrumento(term: string = null): Observable<string[]> {
    let items = this.instrumentosAll;
    if (term) {
        items = items.filter(x => x.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
    }
    return of(items).pipe(delay(500));
  }

  private loadLocalidades() {
    this.localidadesObs = concat(
        of([]), // default items
        this.localidadesInput.pipe(
            distinctUntilChanged(),
            tap(() => this.localidadesLoading = true),
            switchMap(term => this.getLocalidad(term).pipe(
                catchError(() => of([])), // empty list on error
                tap(() => this.localidadesLoading = false)
            ))
        )
    );
  }

  private getLocalidad(term: string = null): Observable<string[]> {
    let items = this.localidadesAll;
    let res = [];
    if (term) {
        res = items.filter(function(x) {
          if (x.toLocaleLowerCase().startsWith(term.toLocaleLowerCase()))
            return true;

          if (x.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) <= -1)
            return false;

          let sep = x.split(" ");

          let contains = false;
          sep.forEach(function(item) {
            if (item.toLocaleLowerCase().startsWith(term.toLocaleLowerCase())) {
              contains = true;
              return;
            }
          });

          return contains;
        });
    }
    return of(res).pipe(delay(500));
  }
  
  
  public aceptarOferta(oferta,indice){
    this._empresaService.getEmpresa(oferta.creador).subscribe(
      response => {
        this.empresa = response [0];
        this.usuario.aceptadas.push(oferta._id);
        this.usuario.solicitadas.splice(indice,1);
        oferta.estado2 = "Asignada";
        this._ofertasService.editar(oferta._id,oferta).subscribe();
        this._artistaService.editar(this.usuario._id,this.usuario).subscribe(
          response => {
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
  
  public precancelar(item,indice,nombre){
    this.itemCancelar = item;
    this.indiceCancelar = indice;
    this.itemCancelarNombre = nombre;
  }

  public cancelarSolicitud(){
    this.ofertas.splice(this.indiceCancelar,1);
    //this.usuario.solicitadas = this.ofertas;

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

    this._artistaService.deleteSolicitada(this.usuario._id,item._id).subscribe(
      response =>{
        this._ofertasService.borrarDescartados(item._id,'',this.usuario._id).subscribe(
          response =>{
          },
          error =>{
          }
        );
        this._ofertasService.borrarPreseleccion(item._id,'',this.usuario._id).subscribe(
          response=>{
          }
        );
        this._ofertasService.borrarSolicitante(item._id,'',this.usuario._id).subscribe(
          response=>{
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  }

}
