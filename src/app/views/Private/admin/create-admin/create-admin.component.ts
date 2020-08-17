import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
  FormControlName,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { AuthService } from "src/app/services/auth/auth.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TokenService } from "src/app/services/auth/token.service";

@Component({
  selector: "app-create-admin",
  templateUrl: "./create-admin.component.html",
  styleUrls: ["./create-admin.component.css"],
})
export class CreateAdminComponent implements OnInit {
  @ViewChild("content") private content;

  constructor(
    private formBuilder: FormBuilder,
    private Auth: AuthService,
    private modal: NgbModal,
    private Token: TokenService
  ) {}

  loading: boolean;
  public passError = "";
  public Form: FormGroup;
  modalTitle: any;
  modalBody: any;

  validation_messages = {
    firstName: [{ type: "required", message: "A First Name is required." }],
    lastName: [{ type: "required", message: "A Last Name is required." }],
    email: [
      { type: "required", message: "An email is required." },
      { type: "pattern", message: "Please enter a valid email" },
    ],
    phone: [
      { type: "required", message: "A Phone Number is required." },
      { type: "pattern", message: "Please enter a valid Phone Number." },
    ],
    collectionCoverageZone: [
      { type: "required", message: "A Collection Coverage Zone is required." },
    ],
    pin: [
      { type: "required", message: "A wallet pin is required." },
      { type: "minlength", message: "Minimum of 4 numbers" },
      { type: "maxlength", message: "Maximum of 6 numbers" },
      { type: "pattern", message: "Only numbers are allowed" },
    ],
    password: [
      { type: "required", message: "A Password is required." },
      { type: "minlength", message: "Minimum of 6 characters" },
    ],
  };

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.Form = this.formBuilder.group({
      firstName: new FormControl(
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required,
        ])
      ),
      lastName: new FormControl(
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required,
        ])
      ),
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      phone: new FormControl(
        "",
        Validators.compose([Validators.pattern("[0-9 ]*"), Validators.required])
      ),
      pin: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(6),
          Validators.pattern("[0-9]*"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
      password_confirmation: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
    });
  }

  makeAdmin(Form) {
    this.loading = true;
    const formdata = new FormData();
    formdata.append("firstName", Form.firstName);
    formdata.append("lastName", Form.lastName);
    formdata.append("email", Form.email);
    formdata.append("phone", Form.phone);
    formdata.append(
      "prevAdminPhone",
      this.Token.phone ? this.Token.phone.toString() : null
    );
    formdata.append("pin", Form.pin);
    formdata.append("password", Form.password);
    formdata.append("password_confirmation", Form.password_confirmation);

    this.Auth.makeAdmin(formdata).subscribe(
      (data) => {
        this.handleResponse(data);
      },
      (error) => {
        this.handleError(error.error);
      }
    );
  }

  handleResponse(data) {
    this.loading = false;
    this.modalTitle = "Success";
    this.modalBody = data.data;
    this.Form.reset();
    this.openModal(this.content);
  }

  handleError(error) {
    console.log(error);
    this.loading = false;
    if (error.errors.password) {
      this.passError = error.errors.password[0];
    } else if (error.errors.email) {
      this.modalTitle = "Error";
      this.modalBody = error.errors.email;
      this.openModal(this.content);
      return;
    } else if (error.errors.phone) {
      this.modalTitle = "Error";
      this.modalBody = error.errors.phone;
      this.openModal(this.content);
      return;
    } else if (error.error) {
      this.modalTitle = "Error";
      this.modalBody = error.error;
      this.openModal(this.content);
      return;
    } else {
      this.modalTitle = "Error";
      this.modalBody = "A server Error has occured";
      this.openModal(this.content);
    }
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }
}
