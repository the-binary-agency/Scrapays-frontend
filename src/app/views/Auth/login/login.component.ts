import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { AuthService } from "src/app/services/auth/auth.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TokenService } from "src/app/services/auth/token.service";
import { Router } from "@angular/router";
import { UserDataService } from "src/app/services/auth/user-data.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  @ViewChild("content") private content;
  loading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private Auth: AuthService,
    private modal: NgbModal,
    private Token: TokenService,
    private router: Router,
    private userData: UserDataService
  ) {}

  initForm() {
    this.PhoneForm = this.formBuilder.group({
      phone: new FormControl(
        "",
        Validators.compose([Validators.pattern("[0-9 ]*"), Validators.required])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
    });
    this.EmailForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(6)])
      ),
    });
  }

  public Error = null;
  public User: string;

  public PhoneForm: FormGroup;
  public EmailForm: FormGroup;
  validation_messages = {
    phone: [
      { type: "required", message: "A Phone Number is required." },
      { type: "pattern", message: "Please enter a valid Phone Number." },
    ],
    email: [
      { type: "required", message: "An email is required." },
      { type: "pattern", message: "Please enter a valid email" },
    ],
    password: [
      { type: "required", message: "A Password is required." },
      { type: "minlength", message: "Minimum of 6 characters" },
    ],
  };

  ngOnInit(): void {
    this.initForm();
    this.User = this.getRoute();
  }

  loginWithPhone(Form) {
    this.loading = true;
    this.Auth.loginWithPhone(Form).subscribe(
      (res:any) => this.handleResponse(res.data),
      (error) => {
        this.handleError(error);
      }
    );
  }

  loginWithEmail(Form) {
    this.loading = true;
    this.Auth.loginWithEmail(Form).subscribe(
      (res:any) => this.handleResponse(res.data),
      (error) => {
        this.handleError(error);
      }
    );
  }

  handleResponse( data ) {
    this.Token.handle(data.access_token);
    this.Auth.changeAuthStatus(true);
    this.loading = false;
    this.goToDashboard(data);
  }

  handleError(error) {
    this.Error = error.error.error;
    this.loading = false;
    this.openModal(this.content);
  }

  goToDashboard(data) {
    this.Auth.changeAuthStatus(true);
    this.userData.updateUserData(data.User);
    if (this.Token.isHousehold()) {
      this.Auth.changeHouseholdStatus(true);
      this.router.navigateByUrl("/dashboard/household");
    } else if (this.Token.isEnterprise()) {
      this.Auth.changeEnterpriseStatus(true);
      this.router.navigateByUrl("/dashboard/enterprise");
    } else if (this.Token.isHost()) {
      this.Auth.changeHostStatus(true);
      this.router.navigateByUrl("/dashboard/host");
    } else if (this.Token.isCollector()) {
      this.Auth.changeCollectorStatus(true);
      this.router.navigateByUrl("/dashboard/collector");
    }
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }

  getRoute() {
    var route = this.router.url;
    return route.split("/")[2];
  }
}
