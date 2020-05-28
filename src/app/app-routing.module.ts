import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';

import { HomeComponent } from './components/home/home.component';

import { ProtegidaComponent } from './components/protegida/protegida.component';
import { CallbackComponent } from './components/callback/callback.component';
import { OfertaComponent } from './components/oferta/oferta.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { EmpresaComponent } from './components/empresa/empresa.component';
import { VistaEmpresaComponent } from './components/vistaEmpresa/vistaEmpresa.component';
import { VistaArtistaComponent } from './components/vistaArtista/vistaArtista.component';
import { GestionofertaComponent } from './components/gestionoferta/gestionoferta.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MisOfertasComponent} from './components/perfil/mis-ofertas/mis-ofertas.component';
import { MisCancionesComponent} from './components/perfil/mis-canciones/mis-canciones.component';
import { MisEnlacesComponent} from './components/perfil/mis-enlaces/mis-enlaces.component';
import { PrivacidadComponent } from './components/privacidad/privacidad.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { RadioComponent } from './components/radio/radio.component';




const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'buscar', component: BuscadorComponent },

  { path: 'oferta/:id', component: OfertaComponent },
  { path: 'empresa/:id', component: VistaEmpresaComponent },
  { path: 'empresa', component: EmpresaComponent},
  { path: 'contacto', component: ContactoComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'privacidad', component: PrivacidadComponent },
  { path: 'terminos', component: TerminosComponent },
  { path: 'musico/:id', component: VistaArtistaComponent },

  { path: 'gestionOferta/:id', component: GestionofertaComponent},
  { path: 'radio', component: RadioComponent},
  {
    path: 'protegida',
    component: ProtegidaComponent,
    canActivate: [ AuthGuard ]
  },
  { path: 'callback', component: CallbackComponent },

  { path: 'perfil', component: PerfilComponent},
  { path: 'perfil/mis-ofertas', component: MisOfertasComponent},
  { path: 'perfil/mis-canciones', component: MisCancionesComponent},
  { path: 'perfil/mis-enlaces', component: MisEnlacesComponent},
  { path: '**', pathMatch: 'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
