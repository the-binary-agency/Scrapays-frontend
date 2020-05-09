import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @ViewChild( 'sidenav' ) public sidenav: MatSidenav;

  constructor ( private sideNavService: NavService ) {
    this.changeSidenavMode();
   }

  screenWidth: number;
  lastHome: string;

  ngOnInit(): void { }
  
  ngAfterViewInit(): void {
  //  this.sideNavService.sideNavToggleSubject.subscribe(()=> {
      this.sidenav.toggle();
  //  } );
    if ( this.screenWidth > 768 ) {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }
  }
  
  changeSidenavMode() {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };
  }

}
