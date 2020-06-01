import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SideMenuService {
  public sideNavToggleSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor () { }
  
  sidemenuexpanded: boolean = true;

  toggleSideMenu(): void {
    this.sidemenuexpanded = !this.sidemenuexpanded;
  }

  public toggle() {
    return this.sideNavToggleSubject.next(null);
  } 
  
}
