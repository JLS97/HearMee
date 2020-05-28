import { Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/Operators';
import { GLOBAL } from './global';

@Injectable()
export class BusquedaService{
    public url:string;
    public termino: string;

    // tslint:disable-next-line: variable-name
    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    count(b){

        let ruta;

        if(b){
            ruta = 'ofertas/cuenta';
        }
        else if(!b){
            ruta = 'artistas/cuenta'
        }

        let headers = new HttpHeaders({'Content-Type':'application/JSON'});

        return this._http.get(this.url+ruta,{headers : headers}).pipe(map((res: Response)=>res));
    }

    solicitar(idOferta,token,idArtista){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});

        let json = JSON.stringify(token);
        let params = json;

        return  this._http.put(this.url+'ofertas/'+idOferta+'/'+idArtista,{headers : headers}).pipe(map((res:Response) => res));
    }

    getTermino(){
        return this.termino;
    }

    setTermino(p){
        if(p!=null){
            this.termino = p;
        }
    }
    analizarTextoBusqueda(busqueda) {
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});

        let json = JSON.stringify(busqueda);

        return  this._http.get(this.url+'busqueda/'+busqueda,{headers : headers}).pipe(map((res:Response) => res));
    }

    buscaGeneroArtista(busqueda){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});

        let json = JSON.stringify(busqueda);

        return  this._http.get(this.url+'artistas/genero/'+busqueda,{headers : headers}).pipe(map((res:Response) => res));
    }

    buscaGeneroOfertas(busqueda){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});

        let json = JSON.stringify(busqueda);

        return  this._http.get(this.url+'ofertas/genero/'+busqueda,{headers : headers}).pipe(map((res:Response) => res));
    }

    buscaCiudadArtista(busqueda){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});

        let json = JSON.stringify(busqueda);

        return  this._http.get(this.url+'artistas/ciudad/'+busqueda,{headers : headers}).pipe(map((res:Response) => res));
    }

    buscaCiudadOferta(busqueda){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});

        let json = JSON.stringify(busqueda);

        return  this._http.get(this.url+'ofertas/ciudad/'+busqueda,{headers : headers}).pipe(map((res:Response) => res));
    }

    listaArtistas(){

        let headers = new HttpHeaders({'Content-Type':'application/JSON'});

        return this._http.get(this.url+'artistas',{headers : headers}).pipe(map((res:Response) => res));

    }

    listaEventos(){

        let headers = new HttpHeaders({'Content-Type':'application/JSON'});

        return this._http.get(this.url+'ofertas/',{headers : headers}).pipe(map((res:Response) => res));

    }
    
    buscarTotalArtistasPorFiltros(filtros) {
        return this.buscarPorFiltros(filtros, true, true, null, null);
    }
    buscarTotalOfertasPorFiltros(filtros) {
        return this.buscarPorFiltros(filtros, false, true, null, null);
    }
    buscarArtistasPorFiltros(filtros, limit, page) {
        return this.buscarPorFiltros(filtros, true, false, limit, page);
    }
    buscarOfertasPorFiltros(filtros, limit, page) {
        return this.buscarPorFiltros(filtros, false, false, limit, page);
    }

    buscarPorFiltros(filtros, buscarArtistas, soloTotal, limit, page) {
        let sueldoMin = filtros["sueldoMin"];
        let sueldoMax = filtros["sueldoMax"];
        let localidades = filtros["localidades"];
        let instrumentos = filtros["instrumentos"];
        let estilos = filtros["estilos"];
        let tituloOferta = filtros["tituloOferta"];
        let nombreArtista = filtros["nombreArtista"];

        let params = {};

        // comprobar si alguno tiene valor para pasar los params, sino pasar sin params
        if (sueldoMin)
            params["sueldoMin"] = sueldoMin;
        if (sueldoMax)
            params["sueldoMax"] = sueldoMax;
        if (localidades && localidades.length > 0)
            params["localidades"] = localidades;
        if (instrumentos && instrumentos.length > 0)
            params["instrumentos"] = instrumentos;
        if (estilos && estilos.length > 0)
            params["estilos"] = estilos;
        if (buscarArtistas && nombreArtista && nombreArtista.length > 0)
            params["nombre"] = nombreArtista;
        if (!buscarArtistas && tituloOferta && tituloOferta.length > 0)
            params["titulo"] = tituloOferta;

        if (!buscarArtistas)
            params["soloAprobadas"] = true;

        if (soloTotal)
            params["soloTotal"] = true;

        if (limit)
            params["limit"] = limit;
        if (page)
            params["page"] = page;

        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        let urlEspecifica = (buscarArtistas) ? "artistas" : "ofertas";
        let options = { 
            "headers": headers, 
            "params": params
        };

        return this._http.get(this.url + urlEspecifica, options).pipe(map((res:Response) => res));
    }

    buscarOfertasPorIds(ids) {
        let params = {};

        if (ids) {
            let aux = [];
            ids.forEach(element => {
                if (element != "[object Object]" && element != "null")
                    aux.push(element);
            });
            params["ids"] = aux;
        }

        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        let options = { 
            "headers": headers, 
            "params": params
        };
        return this._http.get(this.url + "ofertas", options).pipe(map((res:Response) => res));
    }



    buscarArtistasConTexto(texto) {
        return this.buscarConTexto(texto, true);
    }
    buscarOfertasConTexto(texto) {
        return this.buscarConTexto(texto, false);
    }
    buscarConTexto(texto, buscarArtistas) {
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        let urlEspecifica = (buscarArtistas) ? "artistas" : "ofertas";
        let params = {};
        params["search"] = texto;

        if (!buscarArtistas)
            params["soloAprobadas"] = true;
        
        let options = { 
            "headers": headers, 
            "params": params
        };

        return this._http.get(this.url + urlEspecifica, options).pipe(map((res:Response) => res));
    }

}
