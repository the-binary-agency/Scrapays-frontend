import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormControlName, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/services/auth/token.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-enterprise-signup',
  templateUrl: './enterprise-signup.component.html',
  styleUrls: ['./enterprise-signup.component.css']
})
export class EnterpriseSignupComponent implements OnInit {
   @ViewChild( 'content' ) private content;

  constructor(private formBuilder: FormBuilder, private Auth: AuthService, private modal: NgbModal, private Token: TokenService, private router: Router, private loginPage: LoginComponent) {}
  
  
  loading: boolean;
  public error = {password: ''};
  public BusinessForm: FormGroup;
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
      { type: 'pattern', message: 'Please enter a valid business email' }
    ],
    'phone': [
      { type: 'required', message: 'A Phone Number is required.' },
      { type: 'pattern', message: 'Please enter a valid Phone Number.' }
    ],
    'companyName': [
      { type: 'required', message: 'A Company Name is required.' }
    ],
    'companySize': [
      { type: 'required', message: 'A Company Size is required.' }
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
     this.BusinessForm = this.formBuilder.group({
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
      companyName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      companySize: new FormControl(null, Validators.compose([
        Validators.required
      ])),
      role: new FormControl('Enterprise', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      password_confirmation: new FormControl('', Validators.compose([
        Validators.required]))
  });
  }

  registerBusiness( Form ) {
    this.loading = true;
    this.Auth.registerEnterprise( Form ).subscribe(
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
      this.error = error.error.errors.password[0];
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
        phone: this.BusinessForm.value.phone,
        password: this.BusinessForm.value.password
      }
      this.loginPage.loginWithPhone( form );
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }

}
