import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
  FormControlName,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/services/auth/token.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-collector-signup',
  templateUrl: './collector-signup.component.html',
  styleUrls: ['./collector-signup.component.css'],
})
export class CollectorSignupComponent implements OnInit {
  @ViewChild('content') private content;

  constructor(
    private formBuilder: FormBuilder,
    private Auth: AuthService,
    private modal: NgbModal,
    private Token: TokenService,
    private router: Router,
    private loginPage: LoginComponent
  ) {}

  loading: boolean;
  public error = { password: '' };
  public CollectorForm: FormGroup;
  modalTitle: any;
  modalBody: any;

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
    collection_coverage_zone: [
      { type: 'required', message: 'A Collection Coverage Zone is required.' },
    ],
    pin: [
      { type: 'required', message: 'A wallet pin is required.' },
      { type: 'minlength', message: 'Minimum of 4 numbers' },
      { type: 'maxlength', message: 'Maximum of 6 numbers' },
      { type: 'pattern', message: 'Only numbers are allowed' },
    ],
    password: [
      { type: 'required', message: 'A Password is required.' },
      { type: 'minlength', message: 'Minimum of 6 characters' },
    ],
  };

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.CollectorForm = this.formBuilder.group({
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
      collection_coverage_zone: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      invite_code: new FormControl(''),
      pin: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(6),
          Validators.pattern('[0-9]*'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
      password_confirmation: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });
  }

  registerCollector(Form) {
    this.loading = true;
    this.Auth.registerUser('collectors', Form).subscribe(
      (res: any) => {
        this.handleResponse(res.data);
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  handleResponse(data) {
    this.loading = false;
    this.modalTitle = 'Success';
    this.modalBody = data;
    this.openModal(this.content);
    this.goToDashboard();
  }

  handleError(error) {
    this.loading = false;
    this.modalTitle = 'Error';
    this.modalBody = error.error.error;
    this.openModal(this.content);
  }

  goToDashboard() {
    var form = {
      phone: this.CollectorForm.value.phone,
      password: this.CollectorForm.value.password,
    };
    this.loginPage.loginWithPhone(form);
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }
}
