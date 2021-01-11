import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-set-user-password',
  templateUrl: './set-user-password.component.html',
  styleUrls: ['./set-user-password.component.css'],
})
export class SetUserPasswordComponent implements OnInit {
  constructor(private auth: AuthService, private modal: NgbModal) {}
  @ViewChild('content') private content;

  userName = '';
  nameLoading = false;
  nameError: string = '';
  loading = false;
  modalTitle: string;
  modalBody: string;

  payload = {
    phone: '',
    newPin: '',
    newPinConfirmation: '',
    adminPassword: '',
  };

  ngOnInit(): void {}

  PhoneOnFocusOut(e) {
    if (this.payload.phone != '') {
      this.nameLoading = true;
      this.auth.getUserName(this.payload.phone).subscribe(
        (res: any) => {
          this.userName = res.data.Name;
          this.nameLoading = false;
          this.nameError = null;
        },
        (error) => {
          this.nameError = error.error.error;
          this.nameLoading = false;
        }
      );
    }
  }

  changePin() {
    this.loading = true;
    let data = {
      phone: this.payload.phone,
      new_pin: this.payload.newPin,
      new_pin_confirmation: this.payload.newPinConfirmation,
      adminPassword: this.payload.adminPassword,
    };
    this.auth.setUserWalletPin(data).subscribe(
      (res: any) => this.handleSuccess(res.data),
      (error) => this.handleError(error)
    );
  }

  handleSuccess(data) {
    this.modalTitle = 'Success';
    this.modalBody = data;
    this.resetForm();
    this.loading = false;
    this.openModal(this.content);
  }

  handleError(error) {
    this.modalTitle = 'Error';
    this.modalBody = error.error.error;
    this.loading = false;
    this.openModal(this.content);
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }

  resetForm() {
    this.userName = '';
    this.payload = {
      phone: '',
      newPin: '',
      newPinConfirmation: '',
      adminPassword: '',
    };
  }
}
