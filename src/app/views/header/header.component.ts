import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { SideMenuService } from 'src/app/services/side-menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
public loggedIn: boolean;
public Admin: boolean;
public Producer: boolean;
public Vendor: boolean;
public Collector: boolean;
  constructor ( private router: Router, private Auth: AuthService, private Token: TokenService, public sidemenu: SideMenuService ) { 
    this.processRoles();
    
  }

  ngOnInit(): void {
  }

  processRoles() {
    this.Auth.authStatus.subscribe( value => this.loggedIn = value);
    this.Auth.adminStatus.subscribe( value => this.Admin = value );
    this.Auth.producerStatus.subscribe( value => this.Producer = value );
    this.Auth.collectorStatus.subscribe( value => this.Collector = value );
    this.Auth.vendorStatus.subscribe( value => this.Vendor = value );
    
  }

  gotoBusinesses(){
    if(this.router.url == "/producers/businesses" || this.router.url == "/producers/individuals"){
      var el = document.getElementById("businesses");
      this.scroll(el);
    }else{
      this.router.navigateByUrl("/producers/businesses")
    }
  }

  gotoIndividuals(){
    if(this.router.url == "/producers/individuals" || this.router.url == "/producers/businesses"){
      var el = document.getElementById("individuals")
      this.scroll(el);
    }else{
      this.router.navigateByUrl("/producers/individuals")
    }
  }

  scroll(el: HTMLElement){
    el.scrollIntoView();
  }

  logOut(event: MouseEvent){
    event.preventDefault();
    this.Token.remove();
    this.Auth.changeAuthStatus(false);
    this.Auth.changeAdminStatus(false);
    this.Auth.changeProducerStatus(false);
    this.Auth.changeVendorStatus(false);
    this.Auth.changeCollectorStatus(false);
    this.router.navigateByUrl('/login');
  }

}
