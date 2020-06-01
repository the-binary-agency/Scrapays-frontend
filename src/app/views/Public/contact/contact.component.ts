import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/auth/api.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  @ViewChild('content') private content;

  modalTitle: any;
  modalBody: any;
  public Form: FormGroup;
  public loading = false;
  validation_messages = {
    'name': [
      { type: 'required', message: 'A First Name is required.' },
      { type: 'pattern', message: 'Please enter a valid First Name.' },
      { type: 'maxlength', message: 'Please enter a shorter First Name.' }
    ],
    'email': [
      { type: 'required', message: 'An Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'message': [
      { type: 'required', message: 'A message is required.' },
    ]
  };

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private modal: NgbModal) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.Form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.pattern('[a-zA-Z ]*'),
        Validators.required])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      subject: new FormControl( '' ),
      message: new FormControl( '', Validators.compose( [
          Validators.required,
        ] ) ),
    } );
  }

  sendContactMessage( Form ) {
    this.loading = true;
    this.apiService.sendContactMessage( Form ).subscribe(
      data => this.handleResponse( data ),
      error => this.handleError(  error )
    )
  }

  handleResponse( data ) {
    this.modalTitle = "Success";
    this.modalBody = data.message;
    this.loading = false;
    this.openModal( this.content );
    this.resetForm();
  }

  handleError( error ) {
    this.modalTitle = "Error";
    this.modalBody = error.error.message;
    this.loading = false;
    this.openModal(this.content);
  }

  resetForm() {
  this.Form.reset();
  }
  
  openModal(content) {
  this.modal.open(content, { centered: true });
}

}
