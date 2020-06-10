import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

declare let fbq:Function;
declare let gtag:Function;
declare let analytics:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Scrapays-angular';

  constructor(private router: Router){
    router.events.subscribe((y: NavigationEnd) => {
      if(y instanceof NavigationEnd){
        fbq( 'track', 'PageView' );
        analytics.page();
        gtag('js', new Date());
      }
    })
  }
  
}
