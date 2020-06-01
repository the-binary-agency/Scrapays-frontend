import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/services/auth/token.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-response-reset-password',
  templateUrl: './response-reset-password.component.html',
  styleUrls: ['./response-reset-password.component.css']
})
export class ResponseResetPasswordComponent implements OnInit {
@ViewChild('content') private content;
  resetToken: string;
  
  constructor(private formBuilder: FormBuilder, private Auth: AuthService, private modal: NgbModal, private Token: TokenService, private router: Router, private route: ActivatedRoute) {
    this.initForm();
    route.queryParams.subscribe( params => {
      this.resetToken = params[ 'token' ]
    } );
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
      ] ) ),
      password_confirmation: new FormControl('', Validators.compose([
        Validators.required]))
  });
  }

  loading;
  public fullModal = {
    header: null,
    body: null
  }
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

  appendForm() {
     const formData = new FormData();
    formData.append('email', this.Form.get('email').value);
    formData.append('password', this.Form.get('password').value);
    formData.append('password_confirmation', this.Form.get('password_confirmation').value);
    formData.append( 'resetToken', this.resetToken );
    return formData;
  }

  changePass( Form ) {
    this.loading = true;
    let formDetails = this.appendForm();
  this.Auth.changePassword(formDetails).subscribe(
    data => {
      this.handleResponse( data )
    },
    error => {
      this.handleError(error);
    }
  );
}

  handleResponse( data ) {
  this.fullModal.header = "Success";
    this.fullModal.body = data.data;
    // this.Form.reset();
    this.loading = false;
    this.router.navigateByUrl( '/login' );
    this.openModal(this.content);
  // this.Token.handle(data.access_token);
  // this.Auth.changeAuthStatus(true);
  // this.router.navigateByUrl('/dashboard');
}

handleError(error){
  this.fullModal.header = "Error";
    this.fullModal.body = error.error.error;
    this.loading = false;
    this.openModal(this.content);
}


  openModal(content) {
    this.modal.open(content, { centered: true });
  }
}
