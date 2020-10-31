import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/services/auth/token.service';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/auth/user-data.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent implements OnInit {
  @ViewChild('content') private content;
  loading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private Auth: AuthService,
    private modal: NgbModal,
    private Token: TokenService,
    private router: Router,
    private userData: UserDataService
  ) {
    this.initForm();
  }
  initForm() {
    this.Form = this.formBuilder.group({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
    });
  }

  public Error = null;

  public Form: FormGroup;
  validation_messages = {
    email: [
      { type: 'required', message: 'An email is required.' },
      { type: 'pattern', message: 'Please enter a valid email' },
    ],
    password: [
      { type: 'required', message: 'A Password is required.' },
      { type: 'minlength', message: 'Minimum of 6 characters' },
    ],
  };

  ngOnInit(): void {}

  login(Form) {
    this.loading = true;
    this.Auth.loginWithEmail(Form).subscribe(
      (res: any) => this.handleResponse(res.data),
      (error) => {
        this.handleError(error);
      }
    );
  }

  handleResponse(data) {
    this.Token.handle(data.access_token);
    this.Auth.changeAuthStatus(true);
    this.Auth.changeAdminStatus(true);
    this.userData.updateUserData(data.User);
    this.loading = false;
    this.router.navigateByUrl('/dashboard/admin');
  }

  handleError(error) {
    this.Error = error.error.error;
    this.loading = false;
    this.openModal(this.content);
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }
}
