import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
 @ViewChild('content') private content;
  loading: boolean;

  constructor(private formBuilder: FormBuilder, private Auth: AuthService, private modal: NgbModal, private Token: TokenService, private router: Router, private Admin: AdminService) {
    this.initForm();
  }
initForm(){
    this.Form = this.formBuilder.group({
       email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ]))
  });
  }

  public Error = null;

  public Form: FormGroup;
  validation_messages = {
    'email': [
      { type: 'required', message: 'An email is required.' },
      { type: 'pattern', message: 'Please enter a valid email' }
    ],
    'password': [
      { type: 'required', message: 'A Password is required.' },
      { type: 'minlength', message: 'Minimum of 6 characters' },
    ]
  };


  ngOnInit(): void {
  }
  
login(Form){
  this.loading = true;
  this.Auth.loginWithEmail(Form).subscribe(
    data => this.handleResponse(data),
    error => {
      this.handleError(error);
    }
  );
}

  
handleResponse(data){
  this.Token.handle(data.access_token);
  this.Auth.changeAuthStatus( true );
  this.loading = false;
  this.router.navigateByUrl('/dashboard');
}

handleError(error){
  this.Error = error.error.error;
  this.loading = false;
  this.openModal(this.content)
}


  openModal(content) {
    this.modal.open(content, { centered: true });
  }
}
