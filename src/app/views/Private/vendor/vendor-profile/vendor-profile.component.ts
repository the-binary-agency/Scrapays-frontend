import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { EnvironmentService } from 'src/app/services/env/environment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/services/auth/token.service';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.css'],
})
export class VendorProfileComponent implements OnInit {
  @ViewChild('content') private content;

  constructor(
    private auth: AuthService,
    private token: TokenService,
    private env: EnvironmentService,
    private formBuilder: FormBuilder,
    private modal: NgbModal
  ) {
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
    first_name: [{ type: 'required', message: 'A First Name is required.' }],
    last_name: [{ type: 'required', message: 'A Last Name is required.' }],
    email: [
      { type: 'required', message: 'An email is required.' },
      { type: 'pattern', message: 'Please enter a valid email' },
    ],
    phone: [
      { type: 'required', message: 'A Phone Number is required.' },
      { type: 'pattern', message: 'Please enter a valid Phone Number.' },
    ],
    password: [
      { type: 'required', message: 'A Password is required.' },
      { type: 'minlength', message: 'Minimum of 6 characters' },
    ],
  };

  initForm() {
    this.Form = this.formBuilder.group({
      first_name: new FormControl(
        '',
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ])
      ),
      last_name: new FormControl(
        '',
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      phone: new FormControl(
        '',
        Validators.compose([Validators.pattern('[0-9 ]*'), Validators.required])
      ),
    });
  }

  getSingleUser() {
    this.auth.getUserDetails(this.token._id).subscribe(
      (data) => {
        this.User = data;
        // this.getApprovedCollectors();
      },
      (error) => console.log(error)
    );
  }

  getApprovedCollectors() {
    this.auth.getApprovedCollectors(this.User.id).subscribe(
      (data) => (this.approvedCollectors = data),
      (error) => console.log(error)
    );
  }

  approveCollector(id) {
    this.loading = true;
    var payload = { apikey: this.env.API_KEY, collectorID: id };
    this.auth.approveCollector(payload).subscribe(
      (data) => this.handleResponse(data),
      (error) => console.log(error)
    );
  }

  updateProfile(form) {
    this.loading = true;
    var user = this.processForm(form);
    this.auth.updateUser('hosts', user.id, user).subscribe(
      (res: any) => this.handleResponse(res.data),
      (error) => this.handleError(error)
    );
  }

  processForm(Form) {
    var formdata = {
      id: '',
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
    };
    formdata.id = this.User.id;
    formdata.first_name = Form.first_name;
    formdata.last_name = Form.last_name;
    formdata.email = Form.email;
    formdata.phone = Form.phone;

    return formdata;
  }

  handleResponse(data) {
    this.loading = false;
    this.modalTitle = 'Success';
    this.modalBody = data;
    this.openModal(this.content);
  }

  handleError(error) {
    this.loading = false;
    this.modalTitle = 'Error';
    this.modalBody = error.error.error;
    this.openModal(this.content);
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }
}
