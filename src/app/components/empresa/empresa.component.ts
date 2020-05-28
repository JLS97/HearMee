import { Component, OnInit,NgModule } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmpresaService } from "../../services/empresa.service";

import { OfertasService } from '../../services/ofertas.service';
import { MusicosService} from '../../services/musicos.service';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { Empresa } from 'src/app/models/empresa';
import { Oferta } from 'src/app/models/oferta';

import { DataTableDirective } from 'angular-datatables';
import { onErrorResumeNext, Subject, concat, of, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap, delay } from 'rxjs/operators';
import Localidades  from  'src/assets/localidadesNombres.json';
import EstilosMusicales  from  'src/assets/estilos_musicales.json';
import Instrumentos from 'src/assets/instrumentos.json';



   
@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})

export class EmpresaComponent implements OnInit {

  public empresa: Empresa;
  public nuevaOferta: Oferta;
  empresas: any[] = [];
  musicos: any[]= [];
  public ofertas: Oferta[];
  public fechaEV = new Date();
    termino: string;
    public id;
    public eliminarID;
    public eliminarIndice;

    dtOptions: DataTables.Settings = {};
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

  constructor(private activatedRoute: ActivatedRoute,
              // tslint:disable-next-line: variable-name
              private _empresaService: EmpresaService,
              private _ofertasService: OfertasService,
              private _musicosService: MusicosService, 
              private router: Router,
              public auth: AuthService,
              private rutaActiva: ActivatedRoute  ) 

              
              {
                this.empresa = this._empresaService.getIdentity();
                this.nuevaOferta = new Oferta('','','',null,'',null,'','','','','',[],[],[],[],false,'','','');

 }
 
 ngOnInit() {
  this.loadLocalidades();
  this.loadEstilosMusicales();
  this.loadInstrumentos();

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
  if(this._empresaService.getIdentity()==null){
    this.router.navigate(['/home']);
  }else {
    /*this.empresa = this._empresaService.getIdentity();*/
    this.id = this.rutaActiva.snapshot.params.id;
      console.log(this.id);
      this._empresaService.getEmpresa(this.id).subscribe(
        response =>{
          if(!Array.isArray(response) || response.length <= 0 || typeof response[0] != "object")
          return;
          this.empresa = response[0];
          
          console.log(this.empresa);
        },
        error =>{
          console.log(error);
        }
      );
  }
  this.empresa = this._empresaService.getIdentity();
  console.log(this.empresa);
  this.getOfertas();

  /*const table: any = $('table');
    this.dataTable = table.DataTable();*/

}
/*private setDataTableOptions() {
  this.dtOptions = {
pagingType: 'simple',
    pageLength: 10,
infoCallback: function (settings, start: number, end: number,
         mnax: number, total: number, pre: string) {
      const paginate = this.siblings('.dataTables_paginate');
if (total <= 10) {
        paginate.hide();
        $('.dataTables_info').css('display', 'none');
      } else {
        paginate.show();
      }
    }
  };
}*/


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

public preliminar(borraID,indice){
  this.eliminarID = borraID;
  this.eliminarIndice = indice;
}

public eliminar(){
  this.ofertas.splice(this.eliminarIndice,1);
  this._ofertasService.delete(this.eliminarID).subscribe(
    response => {
      //location.reload();
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

public getOfertas(){
  this._empresaService.ofertas(this.empresa._id).subscribe(
    response =>{
      if(!Array.isArray(response) || response.length <= 0 || typeof response[0] != "object")
      return;
      this.ofertas = response;
      this.dtTrigger.next();
      if(this.ofertas.length>0){
        $('.dataTables_empty').css('display','none');
      }else{
        $('.dataTables_empty').css('display','table-cell');
      }
      return this.ofertas;
      
      console.log(this.ofertas);
    },
    error =>{
      console.log(error);
    }
  );
}
public recargar(){
  location.reload();
}


public registraOferta(){
  this.nuevaOferta.creador = this.empresa._id;
  this.nuevaOferta.aprobada = false;
  //this.nuevaOferta.fechaFin = this.nuevaOferta.fechaEvento;
  this._empresaService.nuevaOferta(this.nuevaOferta).subscribe(
    response => {
      console.log(response);
      location.reload();
      //this.router.navigate(['/empresa']);
    },
    error => {
      console.log(error);
    }
  );
  //location.reload();
  //this.router.navigate(['/empresa']);
}

public rellenarDatos(){
console.log("HOLA");
this._empresaService.editar(this.empresa._id,this.empresa).subscribe(
  response => {
    console.log(response);
    this.empresa = response[0];
    //this.router.navigate(['/gestionOferta/'+this.id],this.id);
    //this.router.navigate(['/empresa']);
    location.reload();
  },
  error => {
    console.log(error);
  }
);
//this.router.navigate(['/gestionOferta',this.id],this.id);
}



verEmpresa(idx: number) {
  this.router.navigate(['/empresa', idx] );
  console.log('Te estas metiendo a:', idx);
}
public editarDatos(){
  console.log("HOLA");
  this._empresaService.editar(this.id,this.empresa).subscribe(
    response => {
      console.log(response);
      this.empresa = response[0];
      //this.router.navigate(['/gestionOferta/'+this.id],this.id);
      //this.router.navigate(['/empresa']);
      location.reload();
    },
    error => {
      console.log(error);
    }
  );
  //this.router.navigate(['/gestionOferta',this.id],this.id);
}


}




/*$(document).ready(function() {
  $('#tabla').DataTable( {
      columnDefs: [ {
          targets: [ 0 ],
          orderData: [ 0, 1 ]
      }, {
          targets: [ 1 ],
          orderData: [ 1, 0 ]
      }, {
          targets: [ 4 ],
          orderData: [ 4, 0 ]
      } ]
  } );
} );*/