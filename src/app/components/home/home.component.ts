import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router } from '@angular/router';
import { OfertasService } from '../../services/ofertas.service';
import { MusicosService} from '../../services/musicos.service';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { ArtistaService } from 'src/app/services/artista.services';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Artista } from 'src/app/models/artista';
import { Oferta } from 'src/app/models/oferta';
import { BuscadorService } from 'src/app/services/buscador.service';
import { Busqueda } from '../../models/busqueda';
import Localidades  from  'src/assets/localidadesNombres.json';
import { onErrorResumeNext, Subject, concat, of, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap, delay } from 'rxjs/operators';
//import { exists } from 'fs';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[BusquedaService]
})
export class HomeComponent implements OnInit {
    ofertas: any[] = [];
    musicos: any[]= [];
    termino: string;
    public artista = new Artista('','','','','','',[],'', [], []);
    identity;
    token;
    identityEmpresa;
    tokenEmpresa;
    public artistasDestacados: Artista[] = new Array(3);
    public ofertasDestacadas: Oferta[] = new Array(6);
    
    public localidadesAll = Localidades;
    localidadesObs: Observable<string[]>;
    localidadesInput = new Subject<string>();
    localidadesLoading = false;
    public busqueda: Busqueda;

  constructor(private router: Router,
              public auth: AuthService,
              // tslint:disable-next-line: variable-name
              private _ofertasService: OfertasService,
              private _musicosService: MusicosService, 
              private _busquedaService: BusquedaService,
              private _artistaService: ArtistaService,
              private _empresaService: EmpresaService,
              public _buscadorService: BuscadorService
            ) { 
              this.busqueda = new Busqueda('','');
            }
              

  ngOnInit() {
    this.loadLocalidades();

    this.getIdentity();
    this.getEventos();
    this.getArtistas();
    this.ofertas = this._ofertasService.getOfertas();
    this.musicos=this._musicosService.getMusicos();

  }

 
  public getIdentity(){
    this.identity = this._artistaService.getIdentity();
    this.token = this._artistaService.getToken();

    this.artista = this.identity;

    this.identityEmpresa = this._empresaService.getIdentity();
    this.tokenEmpresa = this._empresaService.getToken();
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

  public getEventos(){
    this._busquedaService.listaEventos().subscribe(
      response => {
        if(!Array.isArray(response) || response.length <= 0 || typeof response[1] != "object")
        return;
        if(response!=null){
          this.ofertasDestacadas[0] = response[0];
          this.ofertasDestacadas[1] = response[1];
          this.ofertasDestacadas[2] = response[2];
          this.ofertasDestacadas[3] = response[3];
          this.ofertasDestacadas[4] = response[4];
          this.ofertasDestacadas[5] = response[5];

          this.ofertasDestacadas[0].foto='assets/images/hotel1.jpg';
          this.ofertasDestacadas[1].foto='assets/images/bar1.jpg';
          this.ofertasDestacadas[2].foto='assets/images/hotel3.jpg';
          this.ofertasDestacadas[3].foto='assets/images/teatro1.jpg';
          this.ofertasDestacadas[4].foto='assets/images/rest1.jpg';
          this.ofertasDestacadas[5].foto='assets/images/fiest1.jpg';
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  public getArtistas(){ 
    this._busquedaService.listaArtistas().subscribe(
      response => {
        if(!Array.isArray(response) || response.length <= 0 || typeof response[1] != "object")
        return;
        if(response!=null){
          this.artistasDestacados[0] = response[response.length - 1];
          this.artistasDestacados[1] = response[response.length - 2];
          this.artistasDestacados[2] = response[response.length - 3];
          this.artistasDestacados[3] = response[response.length - 4];

          this.artistasDestacados[0].foto='assets/images/band1.jpg';
          this.artistasDestacados[1].foto='assets/images/band2.jpg';
          this.artistasDestacados[2].foto='assets/images/band3.jpg';
          this.artistasDestacados[3].foto='assets/images/musicos.jpg';
        }
      },
      error => {
        console.log(error);
      }
    );
  }


  public solicitarOferta(idOferta){
    
    if(this.identity){
      this._busquedaService.solicitar(idOferta,this._artistaService.getToken(),this.artista._id).subscribe(
        response => {
          //console.log(response);
          if(this.artista.solicitadas.includes(idOferta)){
            console.log("ya has solicitado esta oferta");
          }else{
          this.artista.solicitadas.push(idOferta);
          console.log(this.artista.solicitadas);
          this._artistaService.editar(this.artista._id,idOferta).subscribe(
            response => {
              console.log(response);
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

  radio2(){
    location.href="/#/radio2";
  }

  perfil(){
    this.router.navigate( ['/perfil'] );
  }
  
  buscar(tipoBusqueda: string) {
    /*let localidad = this._buscadorService.filtros.localidades;
    let localidades = [localidad];*/
    //this._buscadorService.filtros.localidades = localidades;
    this._buscadorService.setTipoBusqueda(tipoBusqueda);
    /*let buscadorElement = (<HTMLInputElement> document.getElementById('buscador-navbar'));
    buscadorElement.value = this.busqueda.localidad;*/
    this.router.navigate(['/buscar']);

  }

  buscarOferta(termino: string) {
    this.router.navigate( ['/buscar', termino] );
    this._busquedaService.setTermino(termino);
  }
  buscarMusico(termino: string){
    this.router.navigate(['/buscar', termino]);
  }

  verOferta(idx: number) {
    this.router.navigate(['/oferta', idx] );
  }
  radio(){
    window.location.href = 'https://hearmee.ovh/radio';
  //FALTA EL COMPONENTE DE MUSICO PARA PODER VISUALIZARLO.
  }
  verMusico(idx: number){
    this.router.navigate(['/musico', idx]);
  }
}
