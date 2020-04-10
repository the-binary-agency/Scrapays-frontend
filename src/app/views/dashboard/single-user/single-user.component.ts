import { Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/services/nav.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { EnvironmentService } from 'src/app/services/environment.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit {

  constructor ( private nav: NavService, private auth: AuthService, private router: Router, private env: EnvironmentService ) {
     
  }
  
  edit = false;

  ngOnInit(): void {
    this.populateUser();
  }

  User: any = {};

  populateUser() {
    if ( this.nav.get() == null ) {
      var payload = {id: this.getRouteId( this.router.url ), apikey: this.env.API_KEY };
      this.getSingleUser( payload );
    } else {
      this.User = this.nav.get();
    }
  }

  getSingleUser( payload ) {
    this.auth.getUserWithID( payload ).subscribe(
      data => this.User = data,
      error => console.log(error)
    )
  }

  getRouteId( route ) {
    return route.split( '_' )[ 1 ];
  }

}
