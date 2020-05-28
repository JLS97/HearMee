
import { Injectable, NgModule } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/Operators';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { ngModuleJitUrl } from '@angular/compiler';

//.pipe(map(res => res.json()))


@Injectable()
export class EmpresaService{
    
    public url: string;
    public identityEmpresa;
    public tokenEmpresa;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    ofertas(idEmpresa){

        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        return this._http.get(this.url+'ofertas/empresa/'+idEmpresa,{headers: headers}).pipe(map((res:Response)=> res));
    }
    getEmpresa(idEmpresa) {
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
    
        return this._http.get(this.url+'empresas/id/'+idEmpresa,{headers:headers}).pipe(map((res:Response) =>  res));
      }

    signup(empresa_to_login, gethash){
        
        if(gethash==true){
            empresa_to_login.gethash = gethash;
        }
        
        let json = JSON.stringify(empresa_to_login);
        let params = json;

        let headers = new HttpHeaders({'Content-Type':'application/JSON'});


        return this._http.post(this.url+'empresas/login',params,{headers : headers}).pipe(map((res:Response) => res));

    }

    registrar(empresa_to_registrar){
        let params = JSON.stringify(empresa_to_registrar);
        
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});


        return this._http.post(this.url+'empresas',params,{headers : headers}).pipe(map((res:Response) => res));
    
    }

    nuevaOferta(ofertaRegistrar){
        let params = JSON.stringify(ofertaRegistrar);

        /*let tok = JSON.parse(localStorage.getItem('tokenEmpresa'));
        let tok2 = JSON.stringify(tok.message);
        console.log("TOK"+tok2);*/
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        //headers.append('Authorization',tok);

        return this._http.post(this.url+'ofertas',params,{headers:headers}).pipe(map((res:Response) =>  res));
    }

   /* rellenarDatos(idEmpresa,par){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        let json = JSON.stringify(par);
        let params = json;
        return this._http.put(this.url+'empresas/id/'+idEmpresa,params,{headers: headers}).pipe(map((res:Response) => res));
      }*/

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identityEmpresa'));
        
        if(identity != "undefined"){
            this.identityEmpresa = identity;
        }else{
            this.identityEmpresa = null;
        }

        return this.identityEmpresa;

    }

    getToken(){
        let token = JSON.parse(localStorage.getItem('tokenEmpresa'));
        if(token != "undefined"){
            this.tokenEmpresa = token;
        }else{
            this.tokenEmpresa = null;
        }

        return this.tokenEmpresa;

    }
    editar(idEmpresa,par){
        let headers = new HttpHeaders({'Content-Type':'application/JSON'});
        let json = JSON.stringify(par);
        let params = json;
        return this._http.put(this.url+'empresa:'+idEmpresa,params,{headers: headers}).pipe(map((res:Response) => res));
      }

      
}
export interface Empresa{
    nombre:string;
desc: string;
img: string;
f_ini: Date;
tipo: string;
ciudad: string;
estilo: string;
}