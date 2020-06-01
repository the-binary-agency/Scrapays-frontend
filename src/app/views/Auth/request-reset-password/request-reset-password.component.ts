import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/auth/token.service';

@Component({
  selector: 'app-request-reset-password',
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.css']
})
export class RequestResetPasswordComponent implements OnInit {
  @ViewChild('content') private content;

  constructor(private formBuilder: FormBuilder, private Auth: AuthService, private modal: NgbModal, private Token: TokenService, private router: Router) {
    this.initForm();
   }

  ngOnInit(): void {
  }

  initForm(){
    this.Form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
  });
  }

  loading;
  public Error = null;
  public fullModal = {
    header: null,
    body: "A server error has occured"
  }
  public Form: FormGroup;
  validation_messages = {
    'email': [
      { type: 'required', message: 'An email is required.' },
      { type: 'pattern', message: 'Please enter a valid email' }
    ]
  };

  requestPasswordReset(Form){
    this.loading = true;
    this.Auth.sendPasswordResetLink(Form).subscribe(
      data => {
        this.handleResponse(data);
      },
      error => {
        this.handleError(error);
      }
    );
  }

  handleResponse(data){
    this.fullModal.header = "Success";
    this.fullModal.body = data.data;
    this.Form.reset();
    this.loading = false;
    this.openModal(this.content);
    // this.Token.handle(data.access_token);
    // this.Auth.changeAuthStatus(true);
    // this.router.navigateByUrl('/dashboard');
  }

  handleError(error){
    this.fullModal.header = "Error";
    if ( error.error.error ) {
      this.fullModal.body = error.error.error;
    }
    this.loading = false;
    this.openModal(this.content);
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }

}
