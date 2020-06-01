import { Component, OnInit } from '@angular/core';
import { NavService } from 'src/app/services/general/nav.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { EnvironmentService } from 'src/app/services/env/environment.service';
import { TokenService } from 'src/app/services/auth/token.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit {

  constructor ( private nav: NavService, private auth: AuthService, private router: Router, private env: EnvironmentService, private token: TokenService ) {
     
  }
  
  edit = false;

  ngOnInit(): void {
    this.populateUser();
  }

  User: any = {};

  populateUser() {
    if ( this.nav.get() == null ) {
      var payload = {phone: this.token.phone, apikey: this.env.API_KEY };
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

}
