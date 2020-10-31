import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { EnvironmentService } from 'src/app/services/env/environment.service';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
})
export class AdminProfileComponent implements OnInit {
  @ViewChild('content') private content;

  constructor(
    private auth: AuthService,
    private token: TokenService,
    private env: EnvironmentService,
    private formBuilder: FormBuilder,
    private Auth: AuthService,
    private modal: NgbModal
  ) {
    this.getSingleUser();
  }

  ngOnInit(): void {
    this.initForm();
  }

  avatar = 'assets/images/icons/user-icon.png';
  avatar_image: any;
  modalTitle: any;
  modalBody: any;
  loading: boolean;
  URL = this.env.assetUrl;
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
    this.auth.updateUser('admins', this.User.id, user).subscribe(
      (res: any) => this.handleResponse(res.data),
      (error) => this.handleError(error)
    );
  }

  processForm(Form) {
    const formdata = new FormData();
    formdata.append('id', this.User.id);
    formdata.append('first_name', Form.first_name);
    formdata.append('last_name', Form.last_name);
    formdata.append('email', Form.email);
    formdata.append('phone', Form.phone);
    formdata.append('avatar_image', this.avatar_image);

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

  onFileInput(event) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (e: any) => {
      this.avatar = e.target.result;
    };
    this.avatar_image = event.target.files[0];
  }

  displayPermissions() {
    if (this.User.id) {
      let parsed = JSON.parse(this.User.userable.permissions);
      let formatted = [];
      parsed.map((permission, i) => {
        permission = permission.replace(/_/g, ' ');
        if (i + 1 < parsed.length) {
          permission = permission + ',';
        }
        formatted.push(permission);
      });

      return formatted;
    }
  }
}
