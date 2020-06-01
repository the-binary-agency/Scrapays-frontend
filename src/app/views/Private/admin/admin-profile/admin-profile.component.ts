import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { EnvironmentService } from 'src/app/services/env/environment.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  @ViewChild( 'content' ) private content;

  constructor(private auth: AuthService, private token: TokenService, private env: EnvironmentService, private formBuilder: FormBuilder, private Auth: AuthService, private modal: NgbModal) {
    this.getSingleUser();
  }

  ngOnInit(): void {
    this.initForm();
  }

  modalTitle: any;
  modalBody: any;
  loading: boolean;
  edit = false;
  User: any = {};
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
    var user = this.processForm( form );
    this.auth.updateUser( user.id, user ).subscribe(
      data => this.handleResponse( data ),
      error => this.handleError( error )
    )
  }

  processForm( Form ) {
    var formdata = {
      id: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    };
    formdata.id = this.User.id;
    formdata.firstName = Form.firstName;
    formdata.lastName = Form.lastName;
    formdata.email = Form.email;
    formdata.phone = Form.phone;

    return formdata;
  }

  handleResponse(data){
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
}
