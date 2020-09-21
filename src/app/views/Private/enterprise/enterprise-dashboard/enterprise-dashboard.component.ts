import { Component, OnInit, ViewChild } from "@angular/core";
import { TokenService } from "src/app/services/auth/token.service";
import { AuthService } from "src/app/services/auth/auth.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  NgbModal,
  NgbPopoverConfig,
  NgbDatepickerConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { SidenavComponent } from "src/app/Constants/sidenav/sidenav.component";
import {
  NgbDateStruct,
  NgbCalendar,
  NgbDatepicker,
} from "@ng-bootstrap/ng-bootstrap";
import { EnvironmentService } from "src/app/services/env/environment.service";

@Component({
  selector: "app-enterprise-dashboard",
  templateUrl: "./enterprise-dashboard.component.html",
  styleUrls: ["./enterprise-dashboard.component.css"],
})
export class EnterpriseDashboardComponent implements OnInit {
  @ViewChild("content") private content;
  @ViewChild("scheduleModal") scheduleModal;
  @ViewChild("sellBulk") sellBulkModal;
  @ViewChild("dp") dp: NgbDatepicker;

  constructor(
    private token: TokenService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private sidenav: SidenavComponent,
    config: NgbPopoverConfig,
    private calendar: NgbCalendar,
    dateConfig: NgbDatepickerConfig,
    private env: EnvironmentService
  ) {
    var now = new Date();
    config.placement = "bottom";
    dateConfig.minDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
  }

  URL = this.env.backendUrl;
  panelOpenState = false;
  month: any;
  year: any;
  User: any = {
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    role: "",
    created_at: "",
  };
  Scrap: any = {};
  CollectedScrap: any = [];
  totalTonnage: number = 0;
  public Form: FormGroup;
  validation_messages = {
    firstName: [
      { type: "required", message: "A First Name is required." },
      { type: "pattern", message: "Please enter a valid First Name." },
      { type: "maxlength", message: "Please enter a shorter First Name." },
    ],
    lastName: [
      { type: "required", message: "A Last Name is required." },
      { type: "pattern", message: "Please enter a valid Last Name." },
      { type: "maxlength", message: "Please enter a shorter Last Name." },
    ],
    phone: [
      { type: "required", message: "A Phone Number is required." },
      { type: "pattern", message: "Please enter a valid Phone Number." },
      { type: "minlength", message: "Please enter a valid Phone Number." },
      { type: "maxlength", message: "Please enter a valid Phone Number." },
    ],
    email: [
      { type: "required", message: "An Email is required." },
      { type: "pattern", message: "Please enter a valid email." },
    ],
    materialLocation: [
      { type: "required", message: "Material Location is required." },
    ],
    description: [
      { type: "required", message: "Material Description is required." },
    ],
    materialImages: [
      { type: "required", message: "Material Images are required." },
      { type: "minLength", message: "minimum length is {{0}}." },
    ],
  };
  materialType = "aluminium";
  receipt: any = "";
  automated = false;
  materials: any[] = [];
  originalMaterials = [];
  displayedMaterials = [];
  requestMaterials = [];
  modalTitle: any;
  modalBody: any;
  loading = false;
  requestLoading = false;
  model: NgbDateStruct;
  date: { year: number; month: number };
  times = [
    { name: "9:00" },
    { name: "10:00" },
    { name: "11:00" },
    { name: "12:00" },
    { name: "13:00" },
    { name: "14:00" },
    { name: "15:00" },
    { name: "16:00" },
    { name: "17:00" },
    { name: "18:00" },
    { name: "19:00" },
    { name: "20:00" },
  ];
  selectedTime: string;
  materialSelect: string = null;
  requestDescription: string;
  requestComment: string;
  requestAddress: string;
  markDisabled;

  ngOnInit(): void {
    this.getDate();
    this.getUser();
    this.initForm();
    this.getPrices();
    this.getDisabledDates();
  }

  getDate() {
    var now = new Date();
    this.year = now.getFullYear();
    switch (now.getMonth()) {
      case 0:
        this.month = "January";
        break;
      case 1:
        this.month = "February";
        break;
      case 2:
        this.month = "March";
        break;
      case 3:
        this.month = "April";
        break;
      case 4:
        this.month = "May";
        break;
      case 5:
        this.month = "June";
        break;
      case 6:
        this.month = "July";
        break;
      case 7:
        this.month = "August";
        break;
      case 8:
        this.month = "September";
        break;
      case 9:
        this.month = "October";
        break;
      case 10:
        this.month = "November";
        break;
      case 11:
        this.month = "December";
        break;
    }
  }

  getUser() {
    this.loading = true;
    this.auth.getUserWithTonnage(this.token.phone).subscribe(
      (data: any) => {
        this.User = data.user;
        this.CollectedScrap = data.tonnage;
        this.automated = data.user.userable.recoveryAutomated;
        this.processTonnage();
      },
      (error) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  processTonnage() {
    for (let scrap of this.CollectedScrap) {
      this.totalTonnage += scrap.weight;
    }
    this.lineChartData = [
      {
        data: this.getSingleScrapForGraph(),
        label: "Scrap",
      },
    ];
  }

  getSingleScrapForGraph() {
    var data = [];
    var tonnage = this.totalTonnage;
    var label = this.lineChartLabels;
    var scrap = this.Scrap;
    this.CollectedScrap.forEach(function (d) {
      scrap[`${d.name}`] = [`${d.weight}`];
      label.push(d.name);
      var tonn = ((d.weight / tonnage) * 100).toFixed(2);
      data.push(tonn);
    });
    this.loading = false;
    return data;
  }

  getDisabledDates() {
    this.markDisabled = (date) => this.calendar.getWeekday(date) > 6;
    console.log("test disabled", this.markDisabled);
  }

  round(value) {
    return value.toFixed(2);
  }

  roundToWhole(value) {
    return Math.round(value);
  }

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  radioModel: string = "Month";

  // lineChart
  public lineChartData: Array<any> = [
    {
      data: [],
      label: "Scrap",
    },
  ];

  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    animation: false,
    responsive: true,
  };
  public lineChartColours: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
    {
      // dark grey
      backgroundColor: "rgba(77,83,96,0.2)",
      borderColor: "rgba(77,83,96,1)",
      pointBackgroundColor: "rgba(77,83,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,83,96,1)",
    },
    {
      // grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
  ];
  public lineChartLegend = true;
  public lineChartType = "line";

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  initForm() {
    this.Form = this.formBuilder.group({
      materialType: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      materialVolume: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      generatedRevenue: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
      receipt: new FormControl(""),
    });
  }

  onSubmit(Form) {
    this.loading = true;
    var inv = this.processForm(Form);
    this.auth.submitInventory(inv).subscribe(
      (data) => this.handleInvResponse(data),
      (error) => this.handleInvError(error)
    );
  }

  processForm(Form) {
    const formData = new FormData();
    formData.append("material", Form.materialType);
    formData.append("enterpriseID", this.token.phone.toString());
    formData.append("volume", Form.materialVolume);
    formData.append("revenueGenerated", Form.generatedRevenue);
    formData.append("receipt", this.receipt, this.receipt.name);

    return formData;
  }

  test() {
    console.log(this.materialType);
  }

  onFileInput(event) {
    this.receipt = event.target.files[0];
  }

  automatePickup() {
    this.loading = true;
    this.auth.automatePickup({ phone: this.token.phone }).subscribe(
      (data) => this.handleResponse(data),
      (error) => this.handleError(error)
    );
  }

  unAutomatePickup() {
    this.loading = true;
    this.auth.unAutomatePickup({ phone: this.token.phone }).subscribe(
      (data) => this.handleResponse(data),
      (error) => this.handleError(error)
    );
  }

  onSelectMaterial(event: any) {
    var i = this.originalMaterials.indexOf(this.materialSelect);
    this.originalMaterials.splice(i, 1);
    this.requestMaterials.push(this.materialSelect);
  }

  onRemoveMaterial(material: any) {
    var i = this.requestMaterials.indexOf(material);
    this.requestMaterials.splice(i, 1);
    this.originalMaterials.push(material);
  }

  handlePickupError(error) {
    this.loading = false;
    this.requestLoading = false;
    this.modalTitle = "Error";
    this.modalBody = error.error.error;
    this.openModal(this.content);
  }

  handleResponse(data) {
    this.loading = false;
    this.requestLoading = false;
    this.modalTitle = "Success";
    this.modalBody = data.data;
    this.getUser();
    this.openModal(this.content);
  }

  handleError(error) {
    this.loading = false;
    this.requestLoading = false;
    this.modalTitle = "Error";
    this.modalBody = error.error;
    this.openModal(this.content);
  }

  handleInvResponse(data) {
    this.loading = false;
    this.modalTitle = "Success";
    this.modalBody = data[0];
    this.Form.reset();
    this.receipt = "";
    this.getUser();
    this.openModal(this.content);
  }

  handleInvError(error) {
    this.loading = false;
    this.modalTitle = "Error";
    this.modalBody = error.error;
    this.openModal(this.content);
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }

  displayMaterials() {
    for (let i = 0; i < this.materials.length; i++) {
      this.originalMaterials.push(this.materials[i].name);
    }
    for (let i = 0; i <= 3; i++) {
      this.displayedMaterials.push(this.materials[i]);
    }
    this.materials.splice(0, 4);
  }

  addToDisplayedMaterials(material, i) {
    this.materials.splice(i, 1);
    this.materials.push(this.displayedMaterials[3]);
    this.displayedMaterials.splice(3, 1);
    this.displayedMaterials.unshift(material);
  }

  getDisplayedPrice(materialName) {
    var display = this.Scrap[materialName] ? this.Scrap[materialName] : 0;
    return this.roundToWhole(display);
  }

  openScheduleModal() {
    if (this.User.userable.address == null) {
      this.modalTitle = "Error";
      this.modalBody =
        "Please add an address to your profile before making a pickup request.";
      this.openModal(this.content);
      return;
    }
    this.scheduleModal.nativeElement.style.display = "block";
  }

  closeScheduleModal() {
    this.scheduleModal.nativeElement.style.display = "none";
  }

  openSellBulkModal() {
    this.sellBulkModal.nativeElement.style.display = "block";
  }

  closeSellBulkModal() {
    this.sellBulkModal.nativeElement.style.display = "none";
  }

  selectToday() {
    this.model = this.calendar.getToday();
  }

  navigateEvent(event) {
    this.date = event.next;
    console.log(this.date);
  }

  cancelPickup() {
    this.loading = true;
    this.auth.cancelPickup({ phone: this.token.phone }).subscribe(
      (data) => this.handleResponse(data),
      (error) => this.handlePickupError(error)
    );
  }

  requestIncomplete() {
    if (
      this.requestMaterials.length == 0 ||
      !this.requestDescription ||
      !this.model ||
      !this.selectedTime
    ) {
      return true;
    }
    return false;
  }

  requestPickup() {
    this.requestLoading = true;
    var form = {
      id: this.token.phone,
      materials: this.requestMaterials,
      description: this.requestDescription,
      comment: this.requestComment,
      scheduleDate: this.model,
      address: this.requestAddress
        ? this.requestAddress
        : this.User.userable.address,
      scheduleTime: this.selectedTime,
    };
    this.auth.requestPickup(form).subscribe(
      (data) => {
        this.handleResponse(data);
        this.getPrices();
        this.requestMaterials = [];
      },
      (error) => {
        this.handlePickupError(error);
      }
    );
  }

  getPrices() {
    this.auth.getMaterialPrices(this.token.phone).subscribe(
      (data: any) => {
        for (let price of data.prices) {
          this.materials.push(price);
        }
        this.materials.push({
          id: 500,
          name: "Composite",
          image: "composite-icon.png",
        });
        this.displayMaterials();
      },
      (error) => console.log(error)
    );
  }

  addBorder(i) {
    var classes = {};
    if (i == 0 || i == 2) {
      classes["border-right"] = true;
    }
    if (i == 0 || i == 1) {
      classes["border-bottom"] = true;
    }
    return classes;
  }

  testChange(ev) {
    console.log(ev.day);
  }
}
