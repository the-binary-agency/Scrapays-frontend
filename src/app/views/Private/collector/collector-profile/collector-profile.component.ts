import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { EnvironmentService } from "src/app/services/env/environment.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TokenService } from "src/app/services/auth/token.service";

@Component({
  selector: "app-collector-profile",
  templateUrl: "./collector-profile.component.html",
  styleUrls: ["./collector-profile.component.css"],
})
export class CollectorProfileComponent implements OnInit {
  @ViewChild("content") private content;

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

  avatar = "assets/images/icons/user-icon.png";
  avatarImage: any;
  hasVendor = false;
  modalTitle: any;
  modalBody: any;
  loading: boolean;
  edit = false;
  User: any = { userable: {} };
  URL = this.env.backendUrl;
  public Form: FormGroup;
  public VendorIDForm: FormGroup;
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
    password: [
      { type: "required", message: "A Password is required." },
      { type: "minlength", message: "Minimum of 6 characters" },
    ],
    vendorID: [
      { type: "required", message: "A Vendor ID is required." },
      { type: "minlength", message: "Minimum of 6 characters" },
      { type: "minlength", message: "Maximum of 6 characters" },
    ],
  };

  initForm() {
    this.Form = this.formBuilder.group({
      avatarImage: new FormControl(""),
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
      collectionCoverageZone: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
    });
    this.VendorIDForm = this.formBuilder.group({
      vendorID: new FormControl("", Validators.compose([Validators.required])),
    });
  }

  getSingleUser() {
    this.auth.getUserDetails(this.token.phone).subscribe(
      (data) => (this.User = data),
      (error) => console.log(error)
    );
  }

  updateProfile(form) {
    this.loading = true;
    var user = this.processForm(form);
    this.auth.updateUser(this.token.phone, user).subscribe(
      (data) => this.handleResponse(data),
      (error) => this.handleError(error)
    );
  }

  processForm(Form) {
    const formData = new FormData();
    formData.append("firstName", Form.firstName);
    formData.append("lastName", Form.lastName);
    formData.append("email", Form.email);
    formData.append("requestAddress", Form.requestAddress);
    formData.append("avatarImage", this.avatarImage);
    formData.append("collectionCoverageZone", Form.collectionCoverageZone);

    return formData;
  }

  registerVendor(form) {
    this.loading = true;

    var payload = {
      apikey: this.env.API_KEY,
      vendorID: form.vendorID,
      id: this.User.id,
    };
    this.auth.registerVendor(payload).subscribe(
      (data) => this.handleResponse(data),
      (error) => this.handleError(error)
    );
  }

  handleResponse(data) {
    this.edit = false;
    this.loading = false;
    this.modalTitle = "Success";
    this.modalBody = data;
    this.openModal(this.content);
    this.VendorIDForm.reset();
    this.hasVendor = true;
  }

  handleError(error) {
    this.loading = false;
    this.modalTitle = "Error";
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
    this.avatarImage = event.target.files[0];
  }
}
