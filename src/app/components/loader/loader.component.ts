import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from "../../services/loader.service";
import { Subscription } from "rxjs";
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  loadingSubscription: Subscription;

  constructor(private loaderService: LoaderService) {
    
  }

  ngOnInit() {
    console.log("loader cargado");
    this.loadingSubscription = this.loaderService.loadingStatus.pipe(
      debounceTime(200)
    ).subscribe((value) => {
      console.log("loader: " + value);
      this.loading = value;
    });
    /*this.loadingSubscription = this.loaderService.loadingStatus.subscribe((value) => {
      this.loading = value;
    });*/
  }

  ngOnDestroy() {
    console.log("loader: " + this.loading);
    this.loadingSubscription.unsubscribe();
  }

}
