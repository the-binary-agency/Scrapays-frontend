import { Component, OnInit, ViewChild } from "@angular/core";
import { NavService } from "src/app/services/general/nav.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { Router } from "@angular/router";
import { EnvironmentService } from "src/app/services/env/environment.service";
import { TokenService } from "src/app/services/auth/token.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";

export interface Collection {
  id: string;
  producerPhone: string;
  collectorID: string;
  materials: string;
  date: string;
  time: string;
  cost: string;
  paymentMethod: string;
}
@Component({
  selector: "app-single-user",
  templateUrl: "./single-user.component.html",
  styleUrls: ["./single-user.component.css"],
})
export class SingleUserComponent implements OnInit {
  displayedColumns: string[] = [
    "id",
    "producerPhone",
    "collectorID",
    "materials",
    "cost",
    "paymentMethod",
    "time",
    "date",
  ];
  dataSource: MatTableDataSource<Collection>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private nav: NavService,
    private auth: AuthService,
    private router: Router,
    private env: EnvironmentService,
    private token: TokenService
  ) {}

  edit = false;

  ngOnInit(): void {
    this.populateUser();
  }

  User: any = { phone: "", userable: {} };
  loading = false;
  Scrap: any = {};
  SelectedTransaction: any = {};
  CollectedScrap = [];
  Collections = [];
  totalTonnage: number = 0;
  transactions = [];

  populateUser() {
    if (this.nav.get() == null) {
      var id = this.router.url.split("_")[1];
      var payload = {
        adminPhone: this.token.phone,
        userID: "+234" + id,
        userType: "Enterprise",
      };
      this.getSingleUser(payload);
    } else {
      this.User = this.nav.get();
      this.getUserWithTonnage(this.User.phone);
      this.getCollections(this.User.phone);
      this.dataSource = new MatTableDataSource(this.CollectedScrap);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  getSingleUser(payload) {
    this.auth.getUserWithID(payload).subscribe(
      (data: any) => {
        this.User = data;
        this.getUserWithTonnage(data.phone);
        this.getCollections(data.phone);
      },
      (error) => console.log(error)
    );
  }

  getUserWithTonnage(phone) {
    this.loading = true;
    this.auth.getUserWithTonnage(phone).subscribe(
      (data: any) => {
        this.CollectedScrap = data.tonnage;
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

  formatMaterials(mat) {
    let materials = JSON.parse(mat);
    let matToShow = [];
    for (let m of materials) {
      matToShow.push(m.name);
    }
    return matToShow;
  }

  getCollections(phone) {
    this.auth.getCollections(phone).subscribe(
      (res: any) => this.handleCollectionResponse(res),
      (err) => console.log(err)
    );
  }

  handleCollectionResponse(res) {
    this.Collections = res.collections;
    this.dataSource = new MatTableDataSource(this.Collections);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  formatToCurrency(amount) {
    if (amount)
      return parseFloat(amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
  }

  selectTransaction(trans) {
    this.SelectedTransaction = trans;
  }

  evaluateMaterials(materials) {
    return JSON.parse(materials);
  }
}
