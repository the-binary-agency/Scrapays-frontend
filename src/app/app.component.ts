import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { TokenService } from './services/auth/token.service';
import { UserDataService } from './services/auth/user-data.service';
import { SidenavComponent } from './Constants/sidenav/sidenav.component';

declare let fbq:Function;
declare let gtag:Function;
// declare let analytics:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Scrapays-angular';
  page;

  constructor ( private router: Router, private auth: AuthService, private token: TokenService, private userData: UserDataService, private sidenav:SidenavComponent ) {
    console.log("app component constructor");
    
    router.events.subscribe((y: NavigationEnd) => {
      if ( y instanceof NavigationEnd ) {
        this.sidenav.getUser();
        console.log('navigated');
        
        this.page = this.getRoute();
        fbq( 'track', 'PageView' );
        // analytics.page();
        gtag('js', new Date());
      }
    } )
  }

  getRoute() {
    var route = this.router.url;
    return route.split( '/' )[ 1 ];
  }
  
}
