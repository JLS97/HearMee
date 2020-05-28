import { Component, OnInit, Input } from '@angular/core';
import { Oferta } from '../../models/oferta';
import { Artista } from 'src/app/models/artista';
import { ArtistaService } from 'src/app/services/artista.services';
import { BusquedaService } from '../../services/busqueda.service';
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'oferta-card',
  templateUrl: './oferta-card.component.html',
  styleUrls: ['./oferta-card.component.css'],
  providers: [ArtistaService, BusquedaService]
})
export class OfertaCardComponent implements OnInit {

  @Input() oferta: Oferta;
  @Input() identity;
  @Input() artista: Artista;


  constructor(private _artistaService: ArtistaService, private _busquedaService: BusquedaService) { 
    this.oferta = new Oferta('','','','','',[],'','','','','',[],[],[],[],false,'','','');
  }

  ngOnInit() {

  }

  public solicitarOferta(idOferta, tituloOferta){
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
