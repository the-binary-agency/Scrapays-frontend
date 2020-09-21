import {
  Component,
  OnInit,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/services/auth/api.service";
import { TokenService } from "src/app/services/auth/token.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { FormsModule } from "@angular/forms";
import { EnvironmentService } from "src/app/services/env/environment.service";

@Component({
  selector: "app-collector-dashboard",
  templateUrl: "./collector-dashboard.component.html",
  styleUrls: ["./collector-dashboard.component.css"],
})
export class CollectorDashboardComponent implements OnInit {
  @ViewChild("collHist") private collHist;
  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbModal,
    private api: ApiService,
    private Token: TokenService,
    private Auth: AuthService,
    private token: TokenService,
    private env: EnvironmentService
  ) {}

  URL = this.env.backendUrl;
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
  producerPhone: string;
  totalTonnage: number = 0;
  historyLoading: boolean;
  matHist: any = { materials: [] };

  public loading = false;
  materials = [];
  originalMaterials = [];
  displayedMaterials = [];
  collectionMaterials = [];

  ngOnInit(): void {
    this.getUser();
    this.getPrices();
    this.getCollectionshistory();
  }

  initiateTracking() {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition((position) => {
        this.pingServer({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          id: this.User.id,
        });
      });
    }
  }

  pingServer(location) {
    this.Auth.pingServerWithLocation(location).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  getUser() {
    this.Auth.getCollectorWithTonnage(this.token.phone).subscribe(
      (data: any) => {
        this.initiateTracking();
        this.User = data.user;
        this.CollectedScrap = data.tonnage;
        this.processTonnage();
      },
      (error) => console.log(error)
    );
  }

  getPrices() {
    this.Auth.getMaterialPrices(this.token.phone).subscribe(
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

  // getScrap(data) {
  //   this.CollectedScrap = data.tonnage;
  //   // // for ( let mat of data.tonnage ) {
  //   // //   this.CollectedScrap.push( JSON.parse( mat ) );
  //   // // }
  //   // var holder = {};

  //   // this.CollectedScrap.forEach(function(d) {
  //   //   if (holder.hasOwnProperty(d.name)) {
  //   //     holder[d.name] = holder[d.name] + d.weight;
  //   //   } else {
  //   //     holder[d.name] = d.weight;
  //   //   }
  //   // });

  //   // var obj2 = [];

  //   // for (var prop in holder) {
  //   //   obj2.push({ name: prop, weight: holder[prop] });
  //   // }
  //   // console.log(holder, obj2);
  // }

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
    return data;
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
      data: [0, 0, 0, 0, 0],
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

  displayMaterials() {
    for (let i = 0; i < this.materials.length; i++) {
      this.originalMaterials.push(this.materials[i]);
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

  openCollHistModal() {
    this.modal.open(this.collHist, { centered: true, size: "lg" });
  }

  getCollectionshistory() {
    this.historyLoading = true;
    this.Auth.getCollectorCollectionsHistory(this.token.phone).subscribe(
      (res: any) => {
        this.matHist = res.history;
        this.historyLoading = false;
      },
      (err) => {
        this.historyLoading = false;
        console.log(err);
      }
    );
  }

  formatToCurrency(amount) {
    if (amount)
      return parseFloat(amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }
}
