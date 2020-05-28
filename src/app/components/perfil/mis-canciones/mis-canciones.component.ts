
import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OfertasService } from '../../../services/ofertas.service';

import { ArtistaService } from '../../../services/artista.services';
import { EmpresaService } from '../../../services/empresa.service';
import { NgLocalization } from '@angular/common';

import { Oferta } from 'src/app/models/oferta';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';

@Component({
  selector: 'app-mis-canciones',
  templateUrl: './mis-canciones.component.html',
  styleUrls: ['./mis-canciones.component.css']
})
export class MisCancionesComponent implements OnInit {

  public usuario;
  public empresa;
  public ofertas: Oferta[];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
      private activatedRoute: ActivatedRoute,
      private router: Router,
      private _artistaService: ArtistaService,
      private _empresaService: EmpresaService,
      private _ofertasService: OfertasService
    )
    {
      this.activatedRoute.params.subscribe( params => {
      this.usuario = this._artistaService.getIdentity();
      });
      this.empresa = this._empresaService.getIdentity();
    }

  ngOnInit() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      search:true,
      paging:true,
      language: {
        processing: "Procesando...",
        search: "Buscar:",
        lengthMenu: "Mostrar _MENU_  elementos",
        info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
        infoEmpty: "Mostrando ningún elemento.",
        infoFiltered: "(filtrado _MAX_ elementos total)",
        infoPostFix: "",
        loadingRecords: "Cargando registros...",
        zeroRecords: "No se encontraron registros",
        emptyTable: "No hay datos disponibles en la tabla",
        paginate: {
          first: "Primero",
          previous: "Anterior",
          next: "Siguiente",
          last: "Último"
        },
        aria: {
          sortAscending: ": Activar para ordenar la tabla en orden ascendente",
          sortDescending: ": Activar para ordenar la tabla en orden descendente"
        }
      }
    };

    console.log("Perfil Usuario");
    if(this.empresa != null){
      location.href = "/empresa";
    }
    else if(this.usuario == null){
      location.href = "/home";
    }
  }
  verEmpresa(idx: number) {
    this.router.navigate(['/empresa', idx] );
    console.log('Te estas metiendo a:', idx);
  }

  verOferta(idx: number) {
    this.router.navigate(['/oferta', idx] );
    console.log('Te estas metiendo a:', idx);
  }

  public detalleOferta(id){
    console.log(id);
    this.router.navigate(['/gestionOferta/'+id],id);
  }

  public eliminar(borraID){
    this._ofertasService.delete(borraID).subscribe(
      response => {
        location.reload();
      },
      error =>{
        console.log(error);
      }
    );
  }
}

