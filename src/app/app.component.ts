import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ArtistaService } from './services/artista.services';
import { Artista } from './models/artista';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ArtistaService]
})
export class AppComponent implements OnInit {

  public token;
  public identity;
  private showScrollHeight = 400;
  private hideScrollHeight = 200;
  public showGoUpButton: boolean;

  constructor( 
    private auth: AuthService,
    private _artistaService: ArtistaService,
    private router: Router
  ) {
    this.showGoUpButton = false;
  }

  ngOnInit() {
    //this.auth.localAuthSetup();
    this.identity = this._artistaService.getIdentity();
    this.token = this._artistaService.getToken();
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        $(document).ready(function() {
          $('table.table-simple.display').DataTable();
        });
        
        $("#header").removeClass("scrolled");

        if (evt.url == "/buscar") {
          $("#filtro-busqueda-button").prop("checked", $( window ).width() > 1350);
        }
        if (evt.url == "/buscar" || evt.url == "/home" || evt.url == "/") {
          if (!$("#buscador-form").hasClass("ocultar"))
            $("#buscador-form").addClass("ocultar");
          if (!$(".search-toggle").hasClass("ocultar")) {
            $(".search-toggle").addClass("ocultar");
            $("#buscador-navbar-toggle").prop("checked", false);
          }
        } else {
          if ($("#buscador-form").hasClass("ocultar"))
            $("#buscador-form").removeClass("ocultar");
          if ($(".search-toggle").hasClass("ocultar"))
            $(".search-toggle").removeClass("ocultar");
        }

        this.scrollTop();
    });
    
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (( window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop) > this.showScrollHeight) {
        this.showGoUpButton = true;
    } else if ( this.showGoUpButton &&
        (window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop)
        < this.hideScrollHeight) {
        this.showGoUpButton = false;
    }
  }

  scrollTop() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Other
  }
}
