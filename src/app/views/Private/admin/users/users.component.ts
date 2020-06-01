import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/auth/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavService } from 'src/app/services/general/nav.service';
import { TokenService } from 'src/app/services/auth/token.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor ( private api: ApiService, private Auth: AuthService, private nav: NavService, private token: TokenService ) {
      
  }
  
  Users: any[] = [];
  Admins: any[] = [];

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.Auth.getAllUsers(this.token.phone).subscribe(
        data => this.handleResponse(data),
        error => this.handleError( error )
    );
  }

  handleResponse(data){
    data.map( user => {
      if ( user.role == 'Admin' ) {
        this.Admins.push( user );
      } else {
      this.Users.push( user );
      }
    })
  }

handleError(error){
  console.log( error );
}
  
  gotoSingleUser( user ) {
    this.nav.navigate('/dashboard/users/' + user.role + '_' + user.id, user)
  }

  gotoSingleAdmin( admin ) {
    this.nav.navigate('/dashboard/users/Admin_' + admin.id, admin)
  }

//   handleNonAdmin(data){
//       this.Users.push( data );
//   }

//   handleAdmin(data){
//     this.Admins.push( data );
//     console.log(data);
    
//   }

//   getAllUsers() {
//     this.getAllAdmins();
//     this.getAllNonAdmin();
// }
  
//   getAllNonAdmin() {
//     this.Auth.getAllUsers().subscribe(
//         data => this.handleNonAdmin(data),
//         error => this.handleError( error )
//     );
//   }
  
//   getAllAdmins() {
//     this.Auth.getAllAdmins().subscribe(
//         data => this.handleAdmin(data),
//         error => this.handleError( error )
//     );
// }

}
