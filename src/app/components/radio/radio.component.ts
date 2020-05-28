import { Component, OnInit } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import {OfertasService } from '../../services/ofertas.service';

import { AuthService } from '../../services/auth.service';
import {Router } from '@angular/router';

import { Entidad } from '../../../assets/motor/arbol/Entidad';

import { Nodo } from '../../../assets/motor/arbol/Nodo';

import { ViewPort } from '../../../assets/motor/arbol/ViewPort';

import { main } from '../../../assets/motor/Main';



@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit {

  public motoractive = false;
  public  links = new Array();
  public link = '5ec0a3d8ea5e78ca819f7954';
  constructor(
    ) {
    }

  ngOnInit() {
    /*window.setInterval(() => {
      this.comprobar();
    }, 1000)*/
    //this.reproducir();
    this.links.push(this.link);
    var canvas = document.getElementById('canvas');

    var lienzo2 = document.getElementById("div3");

          lienzo2.style.width = window.innerWidth-10 + "px";
          lienzo2.style.height = window.innerHeight-10 + "px";
          

          console.log('Ancho de la pantalla: ' + window.innerWidth);
          console.log('Alto de la pantalla: ' + window.innerHeight);

    
  }

  recargar(){
    window.location.reload();
  }
  
  reproducir() {
    const audio = new Audio('assets/Hola.mp3');
    audio.play();
  }

}
