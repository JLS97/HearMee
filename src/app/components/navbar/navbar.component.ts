import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ArtistaService } from '../../services/artista.services';
import { Artista } from '../../models/artista';
import { FormsModule, ControlContainer } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service'
import { Empresa } from 'src/app/models/empresa';
import { BuscadorService } from 'src/app/services/buscador.service';
import { LoaderService } from "../../services/loader.service";
import { Busqueda } from '../../models/busqueda';
import Localidades  from  'src/assets/localidadesNombres.json';
import { onErrorResumeNext, Subject, concat, of, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap, delay } from 'rxjs/operators';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers:[ArtistaService,EmpresaService,FormsModule, LoaderService]
})
export class NavbarComponent implements OnInit {

  public artista:           Artista;
  public artista_registrar: Artista;

  public empresa:           Empresa;
  public empresa_registrar: Empresa;

  public identity;
  public token;
  public identityEmpresa;
  public tokenEmpresa;
  
  public registro = false;
  public emp = false;

  public incorrecto = false;

  public incorrectoRegistrar = false;
  public search;
  
  public localidadesAll = Localidades;
  localidadesObs: Observable<string[]>;
  localidadesInput = new Subject<string>();
  localidadesLoading = false;
  public busqueda: Busqueda;
 
  constructor( private router: Router,
    private activatedRoute: ActivatedRoute,
    public auth: AuthService,
    public _artistaService: ArtistaService,  
    public _empresaService: EmpresaService,
    public _buscadorService: BuscadorService,
    private loaderService: LoaderService
  ) {
    this.artista = new Artista('','','','','','', [],'', [], []);
    this.artista_registrar = new Artista('','','','','','', [],'', [], []);
    this.empresa = new Empresa('','','','','','','');
    this.empresa_registrar = new Empresa('','','','','','','');
  }

  ngOnInit() {
    this.loadLocalidades();

    this.getIdentity();

    this.registro = false;
    this.ocultarBackgroundMenu();
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
  
  public clickBusqueda() {
      this._buscadorService.filter('Busqueda');
  }

  public perfil(){
    if(this.identityEmpresa!=null){
      this.router.navigate(['/empresa']);
    }
    else if(this.identity!=null){
      this.router.navigate(['/perfil']);
    }
  }

  public getIdentity(){
    this.identity = this._artistaService.getIdentity();
    this.token = this._artistaService.getToken();

    this.identityEmpresa = this._empresaService.getIdentity();
    this.tokenEmpresa = this._empresaService.getToken();
  }

  public login(){
    this.incorrecto = false;
    this.incorrectoRegistrar = false;

    localStorage.removeItem('identityEmpresa');
    localStorage.removeItem('tokenEmpresa');

    this.identityEmpresa = null;
    this.tokenEmpresa = null;

    if(this.artista.email=='' || this.artista.password==''){
      this.incorrecto = true;
    }
    else {
      this._artistaService.signup(this.artista,false).subscribe(
        response => {
          location.reload();
          this.identity = response;
          if(this.identity.message == 'El usuario no existe'){
            console.log('NO EXISTE');
          }
          localStorage.setItem('identity',JSON.stringify(this.identity));
          this._artistaService.signup(this.artista,true).subscribe(
          response => {
            this.token = response;
            localStorage.setItem('token',JSON.stringify(this.token));
          },
          error =>{ 
            //this.incorrecto = true;
          }
          );
        },
        error =>{
          this.incorrecto = true;
        }
      );
    }
  }

  public loginEmpresa(){
  
    this.incorrecto = false;
    this.incorrectoRegistrar = false;

    localStorage.removeItem('identity');
    localStorage.removeItem('token');

    this.identity = null;
    this.token = null;

    if(this.empresa.email=='' || this.empresa.password==''){
      this.incorrecto = true;
    }
    else {
      this._empresaService.signup(this.empresa,false).subscribe(
        response => {
          location.reload();
          this.identityEmpresa = response;
          if(this.identityEmpresa.message == 'El usuario no existe'){
            console.log('NO EXISTE');
          }
          localStorage.setItem('identityEmpresa',JSON.stringify(this.identityEmpresa));
          this._empresaService.signup(this.empresa,true).subscribe(
          response => {
            this.tokenEmpresa = response;
            localStorage.setItem('tokenEmpresa',JSON.stringify(this.tokenEmpresa));
          },
          error =>{ 
          }
          );
        },
        error =>{
          this.incorrecto = true;
        }
      );
    }
  }

  public log(){
    if(this.emp == true){
      this.loginEmpresa();
    }else{
      this.login();
    }
  }

  public reg(){
    if(this.emp == true){
      this.registrarEmpresa();
    }else{
      this.registrar();
    }
  }


  public registroOntrue(){
    if(this.registro == false){
      this.registro = true;
    }else{
      this.registro = false;
    }
    return this.registro;
  }

  public empresaOntrue(value){
    this.emp = value;
  }

  public registroEmpresaOntrue(){
    if(this.registro == false){
      this.registro = true;
    }else{
      this.registro = false;
    }
    return this.registro;
  }

  public registrar(){ 
    this.incorrectoRegistrar = false;

    if(this.artista_registrar.email=='' || this.artista_registrar.password==''){
      this.incorrectoRegistrar = true;
    }
    else{
    
      this._artistaService.registrar(this.artista_registrar).subscribe(
        response =>{
          let hola = response;
          if(response!=null){
            this.artista.email = this.artista_registrar.email;
            this.artista.password = this.artista_registrar.password;
            this.artista = this.artista_registrar;
            this._artistaService.registrado(this.artista).subscribe(
              response => {
                console.log(response);
              },
              error => {
                console.log(error);
              }
            );
            this.login();
          }else{
            this.incorrectoRegistrar = true;
          }
      
        },
        error => {
          this.incorrectoRegistrar = true;
          console.log(error);
        }
      );
    }
  }

  public registrarEmpresa(){
    this.incorrectoRegistrar = false;

    if(this.empresa_registrar.email=='' || this.empresa_registrar.password==''){
      this.incorrectoRegistrar = true;
    }
    else{    
      this._empresaService.registrar(this.empresa_registrar).subscribe(
        response =>{
          let hola = response;
          if(response!=null){
            this.empresa.email = this.empresa_registrar.email;
            this.empresa.password = this.empresa_registrar.password;
            this.empresa.nombre = this.empresa_registrar.nombre;
            this._artistaService.registrado(this.empresa).subscribe();
            this.loginEmpresa();
          }else{
            this.incorrectoRegistrar = true;
          }
      
        },
        error => {
          this.incorrectoRegistrar = true;
          console.log(error.message.text);
        }
      );
    }
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.removeItem('identityEmpresa');
    localStorage.removeItem('tokenEmpresa');
    localStorage.clear();
    this.artista = null;
    this.empresa = null;
    this.router.navigate(['/home']);
    window.location.reload();
  }

  buscarOferta(termino: string) {
    this.router.navigate( ['/buscar', termino] );
    if(window.location.href == './buscar/.'){
      window.location.reload();
    }
  }

  buscar() {
    //this.loading = true;
    if (this.router.url != "/buscar") {
      this.loaderService.startLoading();
      this.router.navigate( ['/buscar'] );
      if(window.location.href == './buscar/.'){
        window.location.reload();
      }
    } else {
      this.clickBusqueda();
    }
    
  }

  ocultarBackgroundMenu() {
    if (this.router.url === "/" || this.router.url === "/home") {
      $(function () {
        let $navMenu = $("#header");
        if ($(document).scrollTop() <= $navMenu.height() && document.location.hash === "#/home")
          $navMenu.addClass("scrolled");
        if ($(document).scrollTop() <= $(".buscador-home-localidades > .ng-select").offset().top && document.location.hash === "#/home") {
          $("#buscador-form").addClass('ocultar');
          $(".search-toggle").addClass('ocultar');
          $("#buscador-navbar-toggle").prop("checked", false);
        }

        $(document).scroll(function () {
          let $nav = $("#header");
          //if (document.location.hash === "#" || document.location.hash === "#/home") {
          let url = document.location.hash;
          if (url === "#/home" || url === "/") {
            $nav.toggleClass('scrolled', $(this).scrollTop() <= $nav.height());
            $("#buscador-form").toggleClass('ocultar', $(this).scrollTop() <= $(".buscador-home-localidades > .ng-select").offset().top);
            $(".search-toggle").toggleClass('ocultar', $(this).scrollTop() <= $(".buscador-home-localidades > .ng-select").offset().top);
            if ($(".search-toggle").hasClass('ocultar'))
              $("#buscador-navbar-toggle").prop("checked", false);
          } else if (url === "#/buscar") {
            if (!$("#buscador-form").hasClass('ocultar'))
              $("#buscador-form").addClass('ocultar');
            if (!$(".search-toggle").hasClass('ocultar')) {
              $(".search-toggle").addClass('ocultar');
              $("#buscador-navbar-toggle").prop("checked", false);
            }
          } else if (url != "#/buscar") {
            if ($("#buscador-form").hasClass('ocultar'))
              $("#buscador-form").removeClass('ocultar');
            if ($(".search-toggle").hasClass('ocultar'))
              $(".search-toggle").removeClass('ocultar');
          }
          //$("#buscador-form").toggle($(this).scrollTop() <= $(".buscador-home-localidades > .ng-select").offset().top && document.location.hash === "#/home");
          /*} else {
            $nav.re
          }*/
        });
      });
    }
  }

}
