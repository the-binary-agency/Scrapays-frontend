import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
import { TokenService } from "src/app/services/auth/token.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
})
export class AdminComponent implements OnInit {
  constructor(
    private Auth: AuthService,
    private token: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserCount();
    this.getPickupRequestCounts();
  }

  public loading = false;
  modalTitle: string;
  modalBody: string;
  lastUpdated: any;
  UserCount: any = {
    producers: 0,
    vendors: 0,
    collectors: 0,
  };
  PickupCount = 0;

  //  lineChart
  public lineChartData: Array<any> = [
    {
      data: [50, 150, 60, 140],
      label: "Listing Deals Done",
    },
  ];

  public lineChartLabels: Array<any> = ["1 Dec", "8 Dec", "18 Dec", "31 Dec"];
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

  public collectionChartLabels = ["Household", "Enterprise", "Collectors"];
  public collectionChartData = [120, 150, 180];
  public collectionChartType = "doughnut";
  public collectionChartColors: Array<any> = [
    {
      backgroundColor: [
        "rgba(240, 255, 0, 1)",
        "rgba(0, 230, 64, 1)",
        "rgba(207, 0, 15, 1)",
      ],
    },
  ];
  public collectionChartOptions = {
    // legend: { position: 'bottom' },
    cutoutPercentage: 70,
  };
  public doughnutChartLabels = ["In Progress", "New Listing", "Completed"];
  public doughnutChartData = [120, 150, 180];
  public doughnutChartType = "doughnut";
  public doughnutChartColors: Array<any> = [
    {
      backgroundColor: [
        "rgba(240, 255, 0, 1)",
        "rgba(0, 230, 64, 1)",
        "rgba(207, 0, 15, 1)",
      ],
    },
  ];
  public doughnutChartOptions = {
    legend: { position: "right" },
    cutoutPercentage: 90,
  };

  getUserCount() {
    this.Auth.getUserCount(this.token.phone).subscribe(
      (data) => {
        this.UserCount = data;
        this.lastUpdated = new Date().toISOString();
      },
      (error) => console.log(error)
    );
  }
  showUsers(users) {
    this.router.navigateByUrl("/dashboard/" + users);
  }

  getPickupRequestCounts() {
    this.Auth.getPickupRequestCounts(this.token.phone).subscribe(
      (data: any) => {
        this.PickupCount = data.pickupCount;
      },
      (error) => console.log(error)
    );
  }
}
