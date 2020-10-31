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

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css'],
})
export class CreateAdminComponent implements OnInit {
  @ViewChild('content') private content;

  constructor(
    private formBuilder: FormBuilder,
    private Auth: AuthService,
    private modal: NgbModal,
    private token: TokenService
  ) {}

  loading: boolean;
  public passError = '';
  public Form: FormGroup;
  modalTitle: any;
  modalBody: any;

  permissionsCheckboxes = [
    'can_view_users',
    'can_update_materials',
    'can_view_revenue',
    'can_give_access_to_collector',
    'can_map_agent',
    'can_give_access_to_agent',
    'can_view_listing',
    'can_view_messages',
    'can_view_producers',
    'all',
  ];

  permissions = [];

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

  makeAdmin(Form) {
    this.loading = true;
    const formdata = {
      first_name: Form.first_name,
      last_name: Form.last_name,
      email: Form.email,
      phone: Form.phone,
      permissions: this.permissions,
      super_admin: this.token._id,
      pin: Form.pin,
      password: Form.password,
      password_confirmation: Form.password_confirmation,
    };

    this.Auth.registerUser('admins', formdata).subscribe(
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
    this.Form.reset();
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

  permissionChecked(event, permission) {
    if (event.checked) {
      this.permissions.push(permission);
    } else {
      this.removeA(this.permissions, permission);
    }
  }

  splitString(string: String) {
    return string.replace(/_/g, ' ');
  }

  removeA(arr, args) {
    var what,
      a = arguments,
      L = a.length,
      ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
  }
}
