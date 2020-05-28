import { Component, OnInit, Input } from '@angular/core';
import { Artista } from '../../models/artista';

@Component({
  selector: 'artista-card',
  templateUrl: './artista-card.component.html',
  styleUrls: ['./artista-card.component.css']
})
export class ArtistaCardComponent implements OnInit {
  @Input() artista: Artista;

  constructor() { 
    this.artista = new Artista('','','','','','', [],'', [], []);
  }

  ngOnInit() {
  }

}
