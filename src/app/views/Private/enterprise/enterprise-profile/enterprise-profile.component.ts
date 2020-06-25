import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { EnvironmentService } from 'src/app/services/env/environment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-enterprise-profile',
  templateUrl: './enterprise-profile.component.html',
  styleUrls: ['./enterprise-profile.component.css']
})
export class EnterpriseProfileComponent implements OnInit {
@ViewChild( 'content' ) private content;

  constructor(private auth: AuthService, private token: TokenService, private env: EnvironmentService, private formBuilder: FormBuilder, private Auth: AuthService, private modal: NgbModal) { }

  ngOnInit(): void {
    this.initForm();
     this.getSingleUser();
  }

  modalTitle: any;
  modalBody: any;
  loading: boolean;
  edit = false;
  User: any = {
    'userable' : {}
  };
  avatarImage: any;
  sex: string;
  public Form: FormGroup;
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

  initForm() {
    this.Form = this.formBuilder.group( {
      avatarImage: new FormControl(''),
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
      companyName: new FormControl('', Validators.compose([
        Validators.required])),
      industry: new FormControl('', Validators.compose([
        Validators.required])),
      companySize: new FormControl('', Validators.compose([
        Validators.required]))
  });
  }

  getSingleUser() {
    this.auth.getUserWithID( this.token.phone ).subscribe(
      data => this.User = data,
      error => console.log( error )
    )
  }

  updateProfile( form ) {
    this.loading = true;
    var user = this.processForm( form )
    this.auth.updateUser( this.token.phone, user ).subscribe(
      data => this.handleResponse( data ),
      error => this.handleError( error )
    )
  }

  processForm( Form ) {
    const formData = new FormData();
      formData.append('firstName', Form.firstName);
      formData.append('lastName', Form.lastName);
      formData.append('phone', Form.phone);
      formData.append('email', Form.email);
      formData.append('companyName', Form.companyName);
      formData.append('companySize', Form.companySize);
      formData.append('industry', Form.industry);
    formData.append( 'sex', Form.sex );
    if ( this.avatarImage ) {
      formData.append('avatarImage', this.avatarImage, this.avatarImage.name);
    }

    return formData;
  }

  handleResponse( data ) {
    this.getSingleUser();
    this.loading = false;
    this.modalTitle = "Success";
    this.modalBody = data;
    this.openModal( this.content );
  }
  
  handleError( error ) {
    this.loading = false;
    this.modalTitle = "Error";
    this.modalBody = error.error.error;
    this.openModal( this.content );
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }

  onFileInput(event) {
    this.avatarImage = event.target.files[0];
  }


}
