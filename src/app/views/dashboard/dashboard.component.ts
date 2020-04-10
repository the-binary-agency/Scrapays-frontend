import { Component, OnInit } from "@angular/core";
import { SideMenuService } from "src/app/services/side-menu.service";
import { TokenService } from 'src/app/services/token.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  constructor ( private sidemenu: SideMenuService, private token: TokenService, private auth: AuthService ) { }
  
  month: any;
  year: any;
  User = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    role: '',
    created_at: ""
  };

  ngOnInit(): void {
    this.getDate();
    // this.getUserData();
  }

  getDate() {
    var now = new Date();
    this.year = now.getFullYear();
    switch (now.getMonth()) {
      case 0:
          this.month = 'January'
        break;
      case 1:
          this.month = 'February'
        break;
      case 2:
          this.month = 'March'
        break;
      case 3:
        this.month = 'April'
        break;
      case 4:
        this.month = 'May'
        break;
      case 5:
        this.month = 'June'
        break;
      case 6:
        this.month = 'July'
        break;
      case 7:
        this.month = 'August'
        break;
      case 8:
        this.month = 'September'
        break;
      case 9:
        this.month = 'October'
        break;
      case 10:
        this.month = 'November'
        break;
      case 11:
        this.month = 'December'
        break;
    }
  }

  getUserData() {
    var token = { token: this.token.get() };
    // this.auth.getUserWithToken( token ).subscribe(
    //   data => console.log( data ),
    //   error => console.log( error )
    // )
  }

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  radioModel: string = "Month";

  // lineChart
  public lineChartData: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: "Series A" },
    { data: [28, 48, 40, 19, 86, 27, 90], label: "Series B" },
    { data: [18, 48, 77, 9, 100, 27, 40], label: "Series C" }
  ];
  public lineChartLabels: Array<any> = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July"
  ];
  public lineChartOptions: any = {
    animation: false,
    responsive: true
  };
  public lineChartColours: Array<any> = [
    {
      // grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    },
    {
      // dark grey
      backgroundColor: "rgba(77,83,96,0.2)",
      borderColor: "rgba(77,83,96,1)",
      pointBackgroundColor: "rgba(77,83,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,83,96,1)"
    },
    {
      // grey
      backgroundColor: "rgba(148,159,177,0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    }
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
}
