import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SideMenuService } from 'src/app/services/general/side-menu.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @ViewChild( 'sidenav' ) public sidenav: MatSidenav;
  @ViewChild( 'content' ) private content;
  public loggedIn: boolean;
  public Admin: boolean;
  public Producer: boolean;
  public Vendor: boolean;
  public Collector: boolean;
  modalTitle: any;
  modalBody: any;
  loading = false;

  constructor ( private sideNavService: SideMenuService, private router: Router,  private Auth: AuthService, private Token: TokenService,  private modal: NgbModal ) {
    this.changeSidenavMode();
   }

  screenWidth: number;
  lastHome: string;

  ngOnInit(): void { 
    this.processRoles();
  }
  
  ngAfterViewInit(): void {
    console.log( 'route is ', this.getRoute() );
    
   this.sideNavService.sideNavToggleSubject.subscribe(()=> {
      this.sidenav.toggle();
   } );
    if ( this.screenWidth > 768 && this.loggedIn ) {
      if ( this.checkRoute() ) {
        this.sidenav.open(); 
      }
    } else {
      this.sidenav.close();
    }
  }
  
  changeSidenavMode() {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      
    console.log(this.getRoute());
      this.screenWidth = window.innerWidth;
    };
  }

  processRoles() {
    this.Auth.authStatus.subscribe( value => this.loggedIn = value);
    this.Auth.adminStatus.subscribe( value => this.Admin = value );
    this.Auth.producerStatus.subscribe( value => this.Producer = value );
    this.Auth.collectorStatus.subscribe( value => this.Collector = value );
    this.Auth.vendorStatus.subscribe( value => this.Vendor = value );
  }


  logOut(event: MouseEvent){
    event.preventDefault();
    this.Token.remove();
    this.Auth.changeAuthStatus(false);
    this.Auth.changeAdminStatus(false);
    this.Auth.changeProducerStatus(false);
    this.Auth.changeVendorStatus(false);
    this.Auth.changeCollectorStatus(false);
    this.sidenav.close();
    this.router.navigateByUrl('/login');
  }

  signOut(){
    this.Token.remove();
    this.Auth.changeAuthStatus(false);
    this.Auth.changeAdminStatus(false);
    this.Auth.changeProducerStatus(false);
    this.Auth.changeVendorStatus(false);
    this.Auth.changeCollectorStatus(false);
    this.router.navigateByUrl('/login');
    this.sidenav.close();
  }

  clickMenu(event: MouseEvent) {
    this.sidenav.toggle();
    event.preventDefault();
  }

  getRoute() {
    var route = this.router.url;
    return route.split( '/' )[ 1 ];
  }

  checkRoute() {
    var excludedRoutes = [ 'home', 'producers', 'enterprises', 'vendors', 'collectors', 'listing' ];
    // var valid: boolean;
    return  Object.values(excludedRoutes).indexOf(this.getRoute()) > -1 ? false : true; 
    // excludedRoutes.map( route => {
   
    //   if ( route == this.getRoute() ) {
    //     valid = false;
    //   } else {
    //     valid = true;
    //   }
    // } )
    // return valid;
  }

  success( message ) {
    this.loading = false;
    this.modalTitle = 'Success';
    this.modalBody = message;
  }
  
  error( error ) {
    this.loading = false;
    this.modalTitle = 'Error';
    this.modalBody = error;
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }
  
}