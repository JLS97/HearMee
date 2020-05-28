
import { Injectable, NgModule } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/Operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { ngModuleJitUrl } from '@angular/compiler';

//.pipe(map(res => res.json()))


@Injectable()
export class ArtistaService{
    
    public url: string;
    public identity;
    public token;
    public id;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    getInfo(id){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});


        return this._http.get(this.url+'artistas/id/'+id,{headers : headers}).pipe(map((res:Response) => res));
    }

    getArtista(id) {
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        return this._http.get(this.url + 'artistas/id/'+id,{headers : headers}).map(res => res);
    }

    signup(artista_to_login, gethash){
        
        if(gethash==true){
            artista_to_login.gethash = gethash;
        }
        
        let json = JSON.stringify(artista_to_login);
        let params = json;

        let headers = new HttpHeaders({'Content-Type':'application/JSON'});


        return this._http.post(this.url+'artistas/login',params,{headers : headers}).pipe(map((res:Response) => res));

    }

    artistasDashboard(){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});


        return this._http.get(this.url+'artistas',{headers : headers}).pipe(map((res:Response) => res));
    }

    ofertasDashboard(){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});


        return this._http.get(this.url+'ofertas ',{headers : headers}).pipe(map((res:Response) => res));
    }

    registrar(artista_to_registrar){
        let params = JSON.stringify(artista_to_registrar);
        
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});


        return this._http.post(this.url+'artistas',params,{headers : headers}).pipe(map((res:Response) => res));
    
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));
        
        if(identity != "undefined"){
            this.identity = identity;
        }
        else{
            this.identity = null;
        }

        return this.identity;

    }


    editar(id,par){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        let json = JSON.stringify(par);
        let params = json;
        return this._http.put(this.url+'artistas/seleccionar/'+id+'/'+par,{headers: headers}).pipe(map((res:Response) => res));
    }

    deleteSolicitada(idArtista,idOferta){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        return this._http.put(this.url+'artistas/deleteSolicitada/'+idArtista+'/'+idOferta,{headers: headers}).pipe(map((res:Response) => res));
    }

    //servicios mailin
    seleccionado(artista){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        let json = JSON.stringify(artista);
        let params = json;

        return this._http.post(this.url+'seleccionado',params,{headers:headers}).pipe(map((res:Response)=>res));
    }

    registrado(artista){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        let json = JSON.stringify(artista);
        let params = json;

        return this._http.post(this.url+'registrado',params,{headers:headers}).pipe(map((res:Response)=>res));
    }

    confirmado(usuario,emailempresa){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        let json = JSON.stringify(usuario);
        let params = json;

        return this._http.post(this.url+'confirmado/'+emailempresa,params,{headers:headers}).pipe(map((res:Response)=>res));
    }

    //fin servicios mailin

    update(id,par){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        let json = JSON.stringify(par);
        let params = json;
        return this._http.put(this.url+'artistas/id/'+id,params,{headers: headers}).pipe(map((res:Response) => res));
    }


    getToken(){
        let token = JSON.parse(localStorage.getItem('token'));
        if(token != "undefined"){
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token;

    }
}