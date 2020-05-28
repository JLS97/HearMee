import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
//import { Busqueda } from '../models/busqueda';
import { Filtros } from '../models/filtros';

@Injectable()
export class BuscadorService {
    private _listners = new Subject<any>();

    //public busqueda: Busqueda;
    public filtros: Filtros;

    constructor() { 
      //this.busqueda = new Busqueda('','');
      this.filtros = new Filtros('','', [], [], [], 'ofertas', '', '');
    }

    /*setBusqueda(busqueda:Busqueda) {
      this.busqueda = busqueda;
    }
    setLocalidad(localidad:string) {
      this.busqueda.localidad = localidad;
    }
    setTipoBusqueda(tipoBusqueda:string) {
      this.busqueda.tipoBusqueda = tipoBusqueda;
    }*/


    setFiltros(filtros:Filtros) {
      this.filtros = filtros;
    }
    setLocalidades(localidades:string[]) {
      this.filtros.localidades = localidades;
    }
    setEstilos(estilos:string[]) {
      this.filtros.estilos = estilos;
    }
    setInstrumentos(instrumentos:string[]) {
      this.filtros.instrumentos = instrumentos;
    }
    setSueldoMax(sueldoMax:string) {
      this.filtros.sueldoMax = sueldoMax;
    }
    setSueldoMin(sueldoMin:string) {
      this.filtros.sueldoMin = sueldoMin;
    }
    setTipoBusqueda(tipoBusqueda:string) {
      this.filtros.tipoBusqueda = tipoBusqueda;
    }
    setNombreArtista(nombreArtista:string) {
      this.filtros.nombreArtista = nombreArtista;
    }
    setTituloOferta(tituloOferta:string) {
      this.filtros.tituloOferta = tituloOferta;
    }

    listen(): Observable<any> {
       return this._listners.asObservable();
    }

    filter(filterBy: string) {
       this._listners.next(filterBy);
    }

}