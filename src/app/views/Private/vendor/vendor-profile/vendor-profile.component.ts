import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { EnvironmentService } from 'src/app/services/env/environment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/services/auth/token.service';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.css']
})
export class VendorProfileComponent implements OnInit {
@ViewChild( 'content' ) private content;

  constructor(private auth: AuthService, private token: TokenService, private env: EnvironmentService, private formBuilder: FormBuilder, private modal: NgbModal) {
    this.getSingleUser();
  }

  ngOnInit(): void {
    this.initForm();
  }

  approvedCollectors: any = [];
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
      data => {
        this.User = data;
        // this.getApprovedCollectors();
      },
      error => console.log( error )
    )
  }

  getApprovedCollectors() {
    var payload = { apikey: this.env.API_KEY, id: this.User.id  };
    this.auth.getApprovedCollectors( payload ).subscribe(
      data => this.approvedCollectors = data,
      error => console.log( error )
    )
  }

  approveCollector( id ) {
    this.loading = true;
    var payload = { apikey: this.env.API_KEY, collectorID: id };
    this.auth.approveCollector( payload ).subscribe(
      data => this.handleResponse( data ),
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
  this.modalBody = data.data;
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
