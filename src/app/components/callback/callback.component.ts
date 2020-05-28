import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor( private auth: AuthService) { }

  ngOnInit() {
    this.auth.handleAuthCallback();
              window.location.href = 'https://hearmee.ovh';
              //location.reload();
  }

}
