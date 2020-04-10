import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {

  constructor () { }
  
  sidemenuexpanded: boolean = true;

  toggleSideMenu(): void {
    this.sidemenuexpanded = !this.sidemenuexpanded;
  }
  
}
