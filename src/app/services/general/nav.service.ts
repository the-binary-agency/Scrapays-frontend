import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  constructor ( private route: Router ) { }
  
  params: any;
  navigate(url, params) {
    this.route.navigateByUrl( url );
    this.params = params;
  }

  get() {
    return this.params;
  }
}
