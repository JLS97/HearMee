import { Component, OnInit, NgModule } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { OfertasService } from '../../services/ofertas.service';
import {Oferta } from '../../models/oferta';
import {Artista } from '../../models/artista';
import {BusquedaService } from '../../services/busqueda.service';
import {HttpErrorResponse } from '@angular/common/http';
import { Subject, concat, of, Observable } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap, tap, delay } from 'rxjs/operators';
import { ArtistaService } from 'src/app/services/artista.services';
import Localidades  from  'src/assets/localidadesNombres.json';
import LocalidadesId  from  'src/assets/localidadesConID.json';
import EstilosMusicales  from  'src/assets/estilos_musicales.json';
import Instrumentos from 'src/assets/instrumentos.json';
import { BuscadorService } from 'src/app/services/buscador.service';
declare var jQuery:any;
declare var $:any;

export interface Localidad {
  id: string;
  nm: string;
}

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css'],
  providers: [ BusquedaService,ArtistaService,OfertasService]
})
export class BuscadorComponent implements OnInit {

    ofertas: any[] = [];

    termino: string;

    public identity;
    public token;

    public resultadosArtista: Artista[];
    public resultadosOferta: Oferta[];
    public oferta: Oferta;

    
    public localidadesAll = Localidades;
    public estilosMusicalesAll = EstilosMusicales;
    public instrumentosAll = Instrumentos;
    public localidadesId = LocalidadesId;

    public numResultados;

    public paginas;
    public c= [];

    public search: string;
    public tipoBusqueda: string;
    public loading: boolean;
    public loaded: boolean;

    public artista = new Artista('','','','','','',[],'', [], []);

    public limit = 20;
    public page: number;
    public finishPage: number;
    

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
              private router: Router,
              private _ofertasService: OfertasService,
              private _busquedaService: BusquedaService,
              private _artistaService: ArtistaService,
              public _buscadorService: BuscadorService) {
                
                this.page = 1;
                this.finishPage = 0;

                this.artista = this._artistaService.getIdentity();
                this.loaded = false;
                this.oferta = new Oferta('','','','','',[],'','','','','',[],[],[],[],false,'','','');
                this.loading = true;
              }

  ngOnInit() {

    this.loadLocalidades();
    this.loadEstilosMusicales();
    this.loadInstrumentos();

    this.identity = this._artistaService.getIdentity();
    this.token = this._artistaService.getToken();

    this.tipoBusqueda = this._buscadorService.filtros.tipoBusqueda;
    this.buscarPorFiltros();

    this.loaded = true;
  }

  scrollTop() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Other
  }
  
  public onScroll() {
    if (this.page < this.finishPage) {
      this.add20Resultados();
      this.page++;
    }
  }

  public add20Resultados() {
    if (this._buscadorService.filtros.tipoBusqueda === "ofertas") {
      this._busquedaService.buscarOfertasPorFiltros(this._buscadorService.filtros, this.limit, this.page + 1).subscribe(
        response => {
          if (response != null) {
            if (Array.isArray(response)) {
              this.resultadosOferta = this.resultadosOferta.concat(response);
            } else {
              let ofertas = response["ofertas"];
              this.resultadosOferta = this.resultadosOferta.concat(ofertas);
            }
          } 
        },
        error => {
        }
      );
    } else if (this._buscadorService.filtros.tipoBusqueda === "artistas") {
      this._busquedaService.buscarArtistasPorFiltros(this._buscadorService.filtros, this.limit, this.page + 1).subscribe(
        response => {
          if (response != null) {
            if (Array.isArray(response)) {
              this.resultadosArtista = this.resultadosArtista.concat(response);
            } else {
              let artistas = response["artistas"];
              this.resultadosArtista = this.resultadosArtista.concat(artistas);
            }
          } 
        },
        error => {
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
        //res = items.filter(x => x.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1 );
        //res = items.filter(x => x.toLocaleLowerCase().startsWith(term.toLocaleLowerCase())  );
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

  verOferta(idx: number) {
    this.router.navigate(['/oferta', idx] );
  }
  verArtista(idx: number) {
    this.router.navigate(['/musico', idx] );
  }

  /*public cambiarTipoDeBusqueda(tipoBusqueda) {
    this.tipoBusqueda = tipoBusqueda;
    if (this.search)
      this.buscarConTexto();
    else
      this.buscarPorFiltros();
  }*/

  public buscarConTexto() {
    if (this._buscadorService.filtros.tipoBusqueda == "ofertas") {
      this._busquedaService.buscarOfertasConTexto(this.search).subscribe(
        response => {
          if (response != null) {
            if (Array.isArray(response)) {
              this.resultadosOferta = response;
              
            } else {
              let ofertas = response["ofertas"];
              let filtrosRes = response["filtros"];
              //this.filtros.estilos = filtrosRes["estilosMusicales"];
              //this.filtros.fechasInicio = filtrosRes["fechasInicio"];
              //this.filtros.instrumentos = filtrosRes["instrumentos"];
              //this.filtros.localidades = filtrosRes["localidades"];

              $('.filtro-busqueda-panel .selectpicker').selectpicker('refresh');
              this.resultadosOferta = ofertas;
            }
          } else {
            this.resultadosOferta = null;
          }
          
          this.numResultados = (this.resultadosOferta) ? this.resultadosOferta.length : 0;
          this.loading = false;
        },
        error => {
          console.log("error ");
          this.resultadosOferta = null;
        }
      );
    } else {
      this._busquedaService.buscarArtistasConTexto(this.search).subscribe(
        response => {          
          if (response != null) {
            if (Array.isArray(response)) {
              this.resultadosArtista = response;
            } else {
              let artistas = response["artistas"];
              let filtrosRes = response["filtros"];
              //this.filtros.estilos = filtrosRes["estilosMusicales"];
              //this.filtros.fechasInicio = filtrosRes["fechasInicio"];
              //this.filtros.instrumentos = filtrosRes["instrumentos"];
              //this.filtros.localidades = filtrosRes["localidades"];      
              
              $('.filtro-busqueda-panel .selectpicker').selectpicker('refresh');

              this.resultadosArtista = artistas;
            }
          } else {
            this.resultadosArtista = null;
          }

          this.numResultados = (this.resultadosArtista) ? this.resultadosArtista.length : 0;
          this.loading = false;
        },
        error => {
          console.log("error ");
          this.resultadosArtista = null;
        }
      );
    }
  }

  private calcularTotalPorFiltros(tipoBusqueda) {
    if (tipoBusqueda === "ofertas") {
      this._busquedaService.buscarTotalOfertasPorFiltros(this._buscadorService.filtros).subscribe(
        response => {
          if (response != null) {
            let total = response["total"];
            if (total) {
              this.numResultados = total;
              this.finishPage = Math.ceil(total / this.limit);
            } else {
              this.numResultados = 0;
              this.finishPage = 0;
            }
          } else {
            this.numResultados = 0;
            this.finishPage = 0;
          }
        },
        error => {
          this.numResultados = 0;
          this.finishPage = 0;
        }
      );
    } else if (tipoBusqueda === "artistas") {
      this._busquedaService.buscarTotalArtistasPorFiltros(this._buscadorService.filtros).subscribe(
        response => {
          if (response != null) {
            let total = response["total"];
            if (total) {
              this.numResultados = total;
              this.finishPage = Math.ceil(total / 20);
            } else {
              this.numResultados = 0;
              this.finishPage = 0;
            }
          } else {
            this.numResultados = 0;
            this.finishPage = 0;
          }
        },
        error => {
          this.numResultados = 0;
          this.finishPage = 0;
        }
      );
    }
  }

  public buscarPorFiltros() {
    this.scrollTop();

    this.tipoBusqueda = this._buscadorService.filtros.tipoBusqueda;

    this.page = 1;
    if (this._buscadorService.filtros.tipoBusqueda == "ofertas") {
      this.calcularTotalPorFiltros("ofertas");
      this._busquedaService.buscarOfertasPorFiltros(this._buscadorService.filtros, this.limit, this.page).subscribe(
        response => {
          if (response != null) {
            if (Array.isArray(response)) {
              this.resultadosOferta = response;
            } else {
              let ofertas = response["ofertas"];
              this.resultadosOferta = ofertas;
            }
          } else {
            this.resultadosOferta = null;
          }
          this.loading = false;
        },
        error => {
          console.log("error ");
          this.resultadosOferta = null;
        }
      );
    } else {
      this.calcularTotalPorFiltros("artistas");
      this._busquedaService.buscarArtistasPorFiltros(this._buscadorService.filtros, this.limit, this.page).subscribe(
        response => {
          if (response != null) {
            if (Array.isArray(response)) {
              this.resultadosArtista = response;
            } else {
              let artistas = response["artistas"];
              this.resultadosArtista = artistas;
            }
          } else {
            this.resultadosArtista = null;
          }

          this.loading = false;
        },
        error => {
          console.log("error ");
          this.resultadosArtista = null;
        }
      );
    }
  }

  //si se invoca con un true es Artista, si se invoca con un false es Evento
  public buscar(tipo,parametro){

    this.resultadosOferta = null;
    this.resultadosArtista = null;

    parametro =  this.search;

    if(parametro== null || parametro == ''){
      if(tipo){
        this.listaArtistas();
      }
      else {
        this.listaOfertas();
      }
    }
    else if(tipo){
      this.buscaArtista(parametro);
    }else if(!tipo){
      this.buscaEvento(parametro);
    }

  }

  public listaArtistas(){

    let aux ;
    this._busquedaService.count(false).subscribe(
      response =>{
        aux = response;
        this.numResultados = aux.cantidad;
      },
      error => {
        this.numResultados = 0;
      }
    );

    this._busquedaService.listaArtistas().subscribe(
      response => {
        if(!Array.isArray(response) || response.length <= 0 || typeof response[1] != "object")
        return;
        this.resultadosArtista = response;
      },
      error => {
        this.resultadosArtista = null;
      }
    );
  }

  public listaOfertas(){
    
    let aux ;
    this._busquedaService.count(true).subscribe(
      response =>{
        aux = response;
        this.numResultados = aux.cantidad;
      },
      error => {
        this.numResultados = 0;
      }
    );

    this._busquedaService.listaEventos().subscribe(
      response => {
        if(!Array.isArray(response) || response.length <= 0 || typeof response[1] != "object")
        return;
        this.resultadosOferta = response;
      },
      error => {
        this.resultadosOferta = null;
      }
    );
  }

  public buscaArtista(parametro){

    if(parametro!=null || parametro!=''){
      this._busquedaService.buscaCiudadArtista(parametro).subscribe(
        response => {
          if(!Array.isArray(response) || response.length <= 0 || typeof response[1] != "object")
          return;
          this.resultadosArtista = response;
          this.numResultados = this.resultadosArtista.length;
        },
        error =>{
          //si hay error significa que la busqueda no es por ciudad si no por genero    
          this._busquedaService.buscaGeneroArtista(parametro).subscribe(
            response =>{
              if(!Array.isArray(response) || response.length <= 0 || typeof response[1] != "object")
              return;
              this.resultadosArtista = response;
              this.numResultados = this.resultadosArtista.length;
            },
            error =>{
              this.resultadosArtista = null;
            }
          );  
        }
      );
    }
  }

  public buscaEvento(parametro){

    this._busquedaService.buscaCiudadOferta(parametro).subscribe(
      response => {
        if(!Array.isArray(response) || response.length <= 0 || typeof response[1] != "object")
        return;
        this.resultadosOferta = response;
        this.numResultados = this.resultadosOferta.length;
      },
      error => {
        this._busquedaService.buscaGeneroOfertas(parametro).subscribe(
          response => {
            if(!Array.isArray(response) || response.length <= 0 || typeof response[1] != "object")
            return;
            this.resultadosOferta = response;
            this.numResultados = this.resultadosOferta.length;
          },
          error => {
            this.resultadosOferta = null;
          }
        );
      }
    );

  }
  //funcion mediante la cual el artista solicita una oferta
  public solicitarOferta(idOferta, tituloOferta){
    console.log(this.artista.solicitadas);
    console.log(idOferta);
    console.log(this.artista.solicitadas.includes(idOferta));
    if(this.identity){
      if (this.artista.solicitadas.includes(idOferta)) {
        this.openIziModal("#modal-inscrito", "Ya has solicitado esta oferta", "fa fa-exclamation-circle", "#BD5B5B");
      } else {
        this._busquedaService.solicitar(idOferta,this._artistaService.getToken(),this.artista._id).subscribe(
          response => {
            console.log(this.artista.solicitadas);
              this.artista.solicitadas.push(idOferta);
              this._artistaService.editar(this.artista._id,idOferta).subscribe(
                response => {
                  this.openIziModal("#modal-inscrito", "Te has inscrito a la oferta '" + tituloOferta + "'", "fa fa-check", "#00af66");
                },
                error => {
                  console.log(error);
                }
              );
          },
          error =>{
    
          }
        );
        
      }
    }
  }

  public openIziModal(selector, title, icon, headerColor) {
    $(selector).iziModal('destroy');
    $(selector).iziModal({
        title: title,
        icon: icon,
        headerColor: headerColor,
        width: "600px",
        timeout: 3000,
        timeoutProgressbar: true,
        transitionIn: 'fadeInUp',
        transitionOut: 'fadeOutDown',
        top: null,
        bottom: 20,
        loop: true,
        pauseOnHover: true,
        overlay: false
    });
    $(selector).iziModal('open');
  }




}