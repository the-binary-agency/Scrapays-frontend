import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { EnvironmentService } from 'src/app/services/env/environment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  @ViewChild('content') private content;

  constructor(
    private auth: AuthService,
    private token: TokenService,
    private env: EnvironmentService,
    private formBuilder: FormBuilder,
    private Auth: AuthService,
    private modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getSingleUser();
  }

  avatar = 'assets/images/icons/user-icon.png';
  modalTitle: any;
  modalBody: any;
  loading: boolean;
  edit = false;
  User: any = { userable: {} };
  avatar_image: any;
  sex: string;
  URL = this.env.assetUrl;
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
      avatar_image: new FormControl(''),
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
      request_address: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });
  }

  getSingleUser() {
    this.auth.getLoggedInUser().subscribe(
      (res: any) => (this.User = res.data),
      (error) => console.log(error)
    );
  }

  updateProfile(form) {
    this.loading = true;
    var user = this.processForm(form);
    this.auth.updateUser('households', this.token._id, user).subscribe(
      (res: any) => this.handleResponse(res.data),
      (error) => this.handleError(error)
    );
  }

  processForm(Form) {
    const formData = new FormData();
    formData.append('first_name', Form.first_name);
    formData.append('last_name', Form.last_name);
    formData.append('email', Form.email);
    formData.append('request_address', Form.request_address);
    formData.append('avatar_image', this.avatar_image);

    return formData;
  }

  handleResponse(data) {
    this.edit = false;
    this.getSingleUser();
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

  onFileInput(event) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e: any) => {
      this.avatar = e.target.result;
    };
    this.avatar_image = event.target.files[0];
  }
}
