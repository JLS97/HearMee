import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Oferta } from 'src/app/models/oferta';
import { Artista } from 'src/app/models/artista';
import { OfertasService } from '../../services/ofertas.service';
import { EmpresaService } from '../../services/empresa.service';
import { ArtistaService } from '../../services/artista.services';
import { Router } from '@angular/router';

import { DataTableDirective } from 'angular-datatables';
import { onErrorResumeNext, Subject, concat, of, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap, delay } from 'rxjs/operators';
import Localidades  from  'src/assets/localidadesNombres.json';
import EstilosMusicales  from  'src/assets/estilos_musicales.json';
import Instrumentos from 'src/assets/instrumentos.json';
import { ControlContainer } from '@angular/forms';


@Component({
  selector: 'app-gestionoferta',
  templateUrl: './gestionoferta.component.html',
  styleUrls: ['./gestionoferta.component.css']
})
export class GestionofertaComponent implements OnInit {
  public id;
  public oferta: Oferta;
  public solicitantes = new Array();
  public preseleccionados = new Array();
  public descartados = new Array();
  public solicitudes: [];
  public seleccion: Artista;
  public ArtistaAsignado: Artista;
  public sel :Artista;

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

  dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
  constructor(
    private rutaActiva: ActivatedRoute,
    private _ofertasService: OfertasService,
    private _empresaService: EmpresaService,
    private _artistaService: ArtistaService,
    private router: Router,
    ) {
    this.oferta = new Oferta('','','','','',[],'','','','','',[],[],[],[],false,'','','');
    this.seleccion = new Artista('','','','','','',[],'', [], []);
    this.ArtistaAsignado = new Artista('','','','','','',[],'', [], []);
    this.sel = new Artista('','','','','','',[],'', [], []);
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
    }
    else {
      this.id = this.rutaActiva.snapshot.params.id;
      this._ofertasService.getOferta(this.id).subscribe(
        response =>{
          if(!Array.isArray(response) || response.length <= 0 || typeof response[0] != "object")
          return;
          this.oferta = response[0];
          
          this.solicitudes = this.oferta.solicitantes;

          if(this.oferta.seleccionado!=null){
            this._artistaService.getArtista(this.oferta.seleccionado).subscribe(
              response =>{
                this.ArtistaAsignado = response[0];
                this.sel = this.ArtistaAsignado;
              },
              error =>{
                this.ArtistaAsignado = null;
              }
            );
          }
          
          this.getSolicitantes(this.solicitudes);
          this.getPreseleccionados(this.oferta.preseleccionados);
          this.getDescartados(this.oferta.descartados);

          
          
          
        },
        error =>{
          console.log(error);
        }
      );
    }
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

  public getSolicitantes(solicitudes){
    if(solicitudes!=null){
      solicitudes.forEach(element => {
        this._artistaService.getInfo(element).subscribe(
          response =>{
            if(!Array.isArray(response) || response.length <= 0 || typeof response[0] != "object")
            return;
            let prov = response[0];
            this.solicitantes.push(response[0]);
          },
          error => {

          }
        );
      });
    }
  }

  public getPreseleccionados(solicitudes){
    if(solicitudes!=null){
      solicitudes.forEach(element => {
        this._artistaService.getInfo(element).subscribe(
          response =>{
            if(!Array.isArray(response) || response.length <= 0 || typeof response[0] != "object")
            return;
            let prov = response[0];
            console.log(response[0]);
            this.preseleccionados.push(response[0]);
            if(this.preseleccionados.length>0){
              $('.dataTables_empty').css('display','none');
            }else{
              $('.dataTables_empty').css('display','table-cell');
            }
          },
          error => {
              console.log(error);
          }
        );
      });
    }
  }

  public getDescartados(solicitudes){
    if(solicitudes!=null){
      solicitudes.forEach(element => {
        this._artistaService.getInfo(element).subscribe(
          response =>{
            if(!Array.isArray(response) || response.length <= 0 || typeof response[0] != "object")
            return;
            let prov = response[0];
            console.log(response[0]);
            this.descartados.push(response[0]);
            if(this.descartados.length>0){
              $('.dataTables_empty').css('display','none');
            }else{
              $('.dataTables_empty').css('display','table-cell');
            }
            /*this.dtTrigger.next();*/
          },
          error => {
            console.log(error);
          }
        );
      });
    }
  }

  public reload(){
    window.location.reload();
  }

  public seleccionar(item){
    console.log(item._id);
    this.oferta.seleccionado = item._id;
    this.sel = item;
    this._ofertasService.editar(this.id,this.oferta).subscribe(
      response => {
        console.log(response);
        this._artistaService.seleccionado(item).subscribe(
          response => {
            console.log(response);
          },
          error => {
            console.log(error);
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  }

  public descarto(){
    this.oferta.seleccionado = "";
    this._ofertasService.editar(this.id,this.oferta).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }

  public preseleccionar(idArtista,num){
    this._ofertasService.preseleccionar(this.id,'',idArtista).subscribe(
      response =>{
        console.log(response);
      },
      error => {

      }
    );
    if(num==1){
      this._ofertasService.borrarSolicitante(this.id,'',idArtista).subscribe(
        response => {
          console.log(response);
          location.reload();
        },
        error =>{

        }
      );
    }else {
      this._ofertasService.borrarDescartados(this.id,'',idArtista).subscribe(
        response => {
          console.log(response);
          location.reload();
        },
        error => {

        }
      );
    }
  }

  public descartar(idArtista,num){
    this._ofertasService.descartar(this.id,'',idArtista).subscribe(
      response => {
        console.log(response);
      },
      error => {

      }
    );
    if(num == 1){
      this._ofertasService.borrarSolicitante(this.id,'',idArtista).subscribe(
        response => {
          console.log(response);
          location.reload();
        },
        error =>{

        }
      );
    }else {
      this._ofertasService.borrarPreseleccion(this.id,'',idArtista).subscribe(
        response => {
          location.reload();
        },
        error => {

        }
      );
    }
  }

  public eliminar(){
    this._ofertasService.delete(this.id).subscribe(
      response => {
        this.router.navigate(['/empresa']);
      },
      error =>{
        console.log(error);
      }
    );
  }

  public editarOferta(){
    this._ofertasService.editar(this.id,this.oferta).subscribe(
      response => {
        this.oferta = response[0];
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

  public inscipciones(){
    return this.solicitudes.length;
  }

  public cerrarOferta(){
    this.oferta.estado2 = "Cerrada";
    this._ofertasService.editar(this.id,this.oferta).subscribe(
      response=>{
        location.reload();
      }
    );
  }

  public abrirOferta(){
    if(this.oferta.estado2 == "Cerrada"){
      this.oferta.estado2 =  "En proceso";
      this._ofertasService.editar(this.id,this.oferta).subscribe(
        response =>{
          location.reload();
        }
      );
    }
  }

  

}
