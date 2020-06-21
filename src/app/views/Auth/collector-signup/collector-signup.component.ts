import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormControlName, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/services/auth/token.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-collector-signup',
  templateUrl: './collector-signup.component.html',
  styleUrls: ['./collector-signup.component.css']
})
export class CollectorSignupComponent implements OnInit {
 @ViewChild( 'content' ) private content;

  constructor(private formBuilder: FormBuilder, private Auth: AuthService, private modal: NgbModal, private Token: TokenService, private router: Router, private loginPage: LoginComponent) {}
  
  
  loading: boolean;
  public error = {password: ''};
  public CollectorForm: FormGroup;
  modalTitle: any;
  modalBody: any;

  validation_messages = {
    'firstName': [
      { type: 'required', message: 'A First Name is required.' }
    ],
    'lastName': [
      { type: 'required', message: 'A Last Name is required.' }
    ],
    'email': [
      { type: 'required', message: 'An email is required.' },
      { type: 'pattern', message: 'Please enter a valid email' }
    ],
    'phone': [
      { type: 'required', message: 'A Phone Number is required.' },
      { type: 'pattern', message: 'Please enter a valid Phone Number.' }
    ],
    'collectionCoverageZone': [
      { type: 'required', message: 'A Collection Coverage Zone is required.' }
    ],
    'password': [
      { type: 'required', message: 'A Password is required.' },
      { type: 'minlength', message: 'Minimum of 6 characters' },
    ]
  };

  ngOnInit(): void {
     this.initForm();
  }

  initForm() {
     this.CollectorForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.compose([
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z ]*'),
        Validators.required])),
      lastName: new FormControl('', Validators.compose([
        Validators.maxLength(30),
        Validators.pattern('[a-zA-Z ]*'),
        Validators.required])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)+.+[a-zA-Z0-9-.]+$')
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.pattern('[0-9 ]*'),
        Validators.required])),
      collectionCoverageZone: new FormControl('', Validators.compose([
        Validators.required])),
      inviteCode: new FormControl(''),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      password_confirmation: new FormControl('', Validators.compose([
        Validators.required]))
  });
  }

  registerCollector( Form ) {
    this.loading = true;
    const formdata = new FormData();
    formdata.append( 'firstName', Form.firstName );
    formdata.append( 'lastName', Form.lastName );
    formdata.append( 'email', Form.email );
    formdata.append( 'phone', Form.phone );
    formdata.append( 'role', 'Collector' );
    formdata.append( 'password', Form.password );
    formdata.append( 'password_confirmation', Form.password_confirmation );

  this.Auth.register(formdata).subscribe(
    data => {
      this.handleResponse(data);
    },
    error => {
      this.handleError(error);
    }
  );
}

  handleResponse(data){
  this.loading = false;
  this.modalTitle = "Success";
  this.modalBody = data.data;
  this.openModal( this.content );
  this.goToDashboard();
}

  handleError( error ) {
    console.log(error)
    this.loading = false;
    if ( error.error.errors.password ) {
      this.error = error.error.errors.password;
    } else if ( error.error.errors.email ) {
      this.modalTitle = "Error";
      this.modalBody = error.error.errors.email;
      this.openModal( this.content );
      return;
    } else if ( error.error.errors.phone ) {
      this.modalTitle = "Error";
      this.modalBody = error.error.errors.phone;
      this.openModal( this.content );
      return;
    } else {
      this.modalTitle = "Error";
      this.modalBody = "A server Error has occured";
      this.openModal( this.content );
    }
  }
  
  goToDashboard() {
        var form = {
        phone: this.CollectorForm.value.phone,
        password: this.CollectorForm.value.password
      }
      this.loginPage.loginWithPhone( form );
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }

}
