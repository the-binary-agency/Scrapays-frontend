import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup, FormControlName, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { password } from '@rxweb/reactive-form-validators';
import { TokenService } from 'src/app/services/auth/token.service';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/auth/admin.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @ViewChild( 'content' ) private content;
   loading: boolean;

  constructor(private formBuilder: FormBuilder, private Auth: AuthService, private modal: NgbModal, private Token: TokenService, private router: Router, private Admin: AdminService) {
    this.initForm();
   }

  modalTitle: any;
  modalBody: any;
  type = "individual";


  initForm(){
    this.Form = this.formBuilder.group({
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
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.pattern('[0-9 ]*'),
        Validators.required])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      password_confirmation: new FormControl('', Validators.compose([
        Validators.required]))
  });
    this.VendorForm = this.formBuilder.group({
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
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.pattern('[0-9 ]*'),
        Validators.required])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      password_confirmation: new FormControl('', Validators.compose([
        Validators.required]))
  });
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
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      phone: new FormControl('', Validators.compose([
        Validators.pattern('[0-9 ]*'),
        Validators.required])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      password_confirmation: new FormControl('', Validators.compose([
        Validators.required]))
  });
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
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      password_confirmation: new FormControl('', Validators.compose([
        Validators.required]))
  });
  }


  ngOnInit(): void {
  }


  public error = {password: ''};
  public Form: FormGroup;
  public VendorForm: FormGroup;
  public CollectorForm: FormGroup;
  public BusinessForm: FormGroup;
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
    'password': [
      { type: 'required', message: 'A Password is required.' },
      { type: 'minlength', message: 'Minimum of 6 characters' },
    ]
  };
  vendor_validation_messages = {
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
    'password': [
      { type: 'required', message: 'A Password is required.' },
      { type: 'minlength', message: 'Minimum of 6 characters' },
    ]
  };
  collector_validation_messages = {
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
    'password': [
      { type: 'required', message: 'A Password is required.' },
      { type: 'minlength', message: 'Minimum of 6 characters' },
    ]
  };


  register( Form ) {
    this.loading = true;
    const formdata = new FormData();
    formdata.append( 'firstName', Form.firstName );
    formdata.append( 'lastName', Form.lastName );
    formdata.append( 'email', Form.email );
    formdata.append( 'phone', Form.phone );
    formdata.append( 'type', 'Individual' );
    formdata.append( 'role', 'Producer' );
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

  registerBusiness( Form ) {
    this.loading = true;
    const formdata = new FormData();
    formdata.append( 'firstName', Form.firstName );
    formdata.append( 'lastName', Form.lastName );
    formdata.append( 'email', Form.email );
    formdata.append( 'phone', Form.phone );
    formdata.append( 'type', 'Business' );
    formdata.append( 'role', 'Producer' );
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
  
  registerVendor( Form ) {
    this.loading = true;
    const formdata = new FormData();
    formdata.append( 'firstName', Form.firstName );
    formdata.append( 'lastName', Form.lastName );
    formdata.append( 'email', Form.email );
    formdata.append( 'phone', Form.phone );
    formdata.append( 'role', 'Vendor' );
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
   this.Token.handle(data.access_token);
  this.Auth.changeAuthStatus( true );
  this.loading = false;
  this.modalTitle = "Success";
  this.modalBody = "Account created Successfully.";
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
    this.Auth.changeAuthStatus( true );
    if ( this.Token.isProducer() ) {
      this.Auth.changeProducerStatus( true );
      this.router.navigateByUrl('/dashboard/producer');
    } else if ( this.Token.isVendor() ) { 
      this.Auth.changeVendorStatus( true );
      this.router.navigateByUrl('/dashboard/vendor');
    } else if ( this.Token.isCollector() ) {
      this.Auth.changeCollectorStatus( true );
      this.router.navigateByUrl('/dashboard/collector');
    }
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }

}
