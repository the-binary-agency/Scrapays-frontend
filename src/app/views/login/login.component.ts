import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('content') private content;
  loading: boolean;
  
  constructor(private formBuilder: FormBuilder, private Auth: AuthService, private modal: NgbModal, private Token: TokenService, private router: Router) {
    this.initForm();
   }

  initForm(){
    this.PhoneForm = this.formBuilder.group({
      phone: new FormControl('', Validators.compose([
        Validators.pattern('[0-9 ]*'),
        Validators.required ] ) ),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ]))
  });
    this.EmailForm = this.formBuilder.group({
       email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ]))
  });
  }

  public Error = null;

  public PhoneForm: FormGroup;
  public EmailForm: FormGroup;
  validation_messages = {
    'phone': [
      { type: 'required', message: 'A Phone Number is required.' },
      { type: 'pattern', message: 'Please enter a valid Phone Number.' }
    ],
    'email': [
      { type: 'required', message: 'An email is required.' },
      { type: 'pattern', message: 'Please enter a valid business email' }
    ],
    'password': [
      { type: 'required', message: 'A Password is required.' },
      { type: 'minlength', message: 'Minimum of 6 characters' },
    ]
  };


  ngOnInit(): void {
  }

loginWithPhone(Form){
  this.loading = true;
  this.Auth.loginWithPhone(Form).subscribe(
    data => this.handleResponse(data),
    error => {
      this.handleError(error);
    }
  );
}
  
loginWithEmail(Form){
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
  this.goToDashboard();
}

handleError(error){
  this.Error = error.error.error;
  this.loading = false;
  this.openModal(this.content)
}
  
  goToDashboard() {
    if ( this.Token.isProducer() ) {
      this.router.navigateByUrl('/dashboard/producer');
    } else if ( this.Token.isVendor() ) {
      
      this.router.navigateByUrl('/dashboard/vendor');
    } else if ( this.Token.isCollector() ) {
      this.router.navigateByUrl('/dashboard/collector');
    }
  }


  openModal(content) {
    this.modal.open(content, { centered: true });
  }

}
