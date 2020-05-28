import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ProtegidaComponent } from './components/protegida/protegida.component';
import { CallbackComponent } from './components/callback/callback.component';

import { HttpClientModule } from '@angular/common/http';
import { OfertasService } from './services/ofertas.service';
import { OfertaComponent } from './components/oferta/oferta.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { FooterComponent } from './components/footer/footer.component';


import { FormsModule, NgControl }   from '@angular/forms';
import { PerfilComponent } from './components/perfil/perfil.component';
import { EmpresaComponent } from './components/empresa/empresa.component';
import { EmpresaService } from './services/empresa.service';
import { VistaEmpresaComponent } from './components/vistaEmpresa/vistaEmpresa.component';
import { VistaArtistaComponent } from './components/vistaArtista/vistaArtista.component';
import { GestionofertaComponent } from './components/gestionoferta/gestionoferta.component';
import { BuscadorService } from './services/buscador.service';

import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';

/*import { LoaderInterceptor } from './interceptors/loader.interceptor';*/
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

import { DataTablesModule } from 'angular-datatables';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MisOfertasComponent } from './components/perfil/mis-ofertas/mis-ofertas.component';
import { MisCancionesComponent } from './components/perfil/mis-canciones/mis-canciones.component';
import { MisEnlacesComponent } from './components/perfil/mis-enlaces/mis-enlaces.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { PrivacidadComponent } from './components/privacidad/privacidad.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { RadioComponent } from './components/radio/radio.component';
import { BusquedaService } from './services/busqueda.service';
import { OfertaCardComponent } from './components/oferta-card/oferta-card.component';
import { ArtistaCardComponent } from './components/artista-card/artista-card.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProtegidaComponent,
    CallbackComponent,
    RadioComponent,
    OfertaComponent,
    BuscadorComponent,
    ContactoComponent,
    PerfilComponent,
    EmpresaComponent,
    VistaEmpresaComponent,
    VistaArtistaComponent,
    GestionofertaComponent,
    DashboardComponent,
    MisOfertasComponent,
    MisCancionesComponent,
    MisEnlacesComponent,
    PrivacidadComponent,
    TerminosComponent,
	FooterComponent,
	LoaderComponent,
  RadioComponent,
  OfertaCardComponent,
  ArtistaCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    DataTablesModule,
    NgSelectModule,
    InfiniteScrollModule
  ],
  providers: [
    OfertasService,
    EmpresaService,
    BuscadorService,
    BusquedaService,
    {provide : LocationStrategy , useClass: HashLocationStrategy},
    /*{
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
