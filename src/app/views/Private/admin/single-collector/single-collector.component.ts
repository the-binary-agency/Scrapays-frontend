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
import { materialize } from "rxjs/operators";
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";

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
  selector: "app-single-collector",
  templateUrl: "./single-collector.component.html",
  styleUrls: ["./single-collector.component.css"],
})
export class SingleCollectorComponent implements OnInit {
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
  @ViewChild("collHist") private collHist;

  constructor(
    private nav: NavService,
    private auth: AuthService,
    private router: Router,
    private modal: NgbModal,
    private env: EnvironmentService,
    private token: TokenService,
    private calender: NgbCalendar
  ) {}

  edit = false;

  ngOnInit(): void {
    this.configureDate();
    this.populateUser();
  }

  User: any = { phone: "", userable: {} };
  loading = false;
  Scrap: any = {};
  SelectedTransaction: any = {};
  CollectedScrap = [];
  Collections = [];
  totalTonnage: number = 0;
  historyLoading: boolean;
  matHist: any = { materials: [] };
  model: NgbDateStruct;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  maxDate: NgbDateStruct;

  configureDate() {
    this.fromDate = this.calender.getPrev(this.calender.getToday(), "d", 6);
    this.maxDate = this.calender.getToday();
    this.toDate = this.calender.getToday();
  }

  populateUser() {
    if (this.nav.get() == null) {
      var id = this.router.url.split("_")[1];
      var payload = {
        adminPhone: this.token.phone,
        userID: "+234" + id,
        userType: "Collector",
      };
      this.getSingleUser(payload);
    } else {
      this.User = this.nav.get();
      this.getCollectorWithTonnage(this.User.phone);
      this.getCollections(this.User.phone);
      this.dataSource = new MatTableDataSource(this.Collections);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  getSingleUser(payload) {
    this.auth.getUserWithID(payload).subscribe(
      (data: any) => {
        this.User = data;
        this.getCollectorWithTonnage(data.phone);
        this.getCollections(data.phone);
      },
      (error) => console.log(error)
    );
  }

  getCollectorWithTonnage(phone) {
    this.getCollectionshistory(phone);
    this.loading = true;
    this.auth.getCollectorWithTonnage(phone).subscribe(
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
    this.auth.getCollectorCollections(phone).subscribe(
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

  openCollHistModal() {
    this.modal.open(this.collHist, { centered: true, size: "lg" });
  }

  getCollectionshistory(phone) {
    this.historyLoading = true;
    this.auth.getCollectorCollectionsHistory(phone).subscribe(
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

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  filterByDate() {
    this.historyLoading = true;
    if (this.toDate == null) {
      this.toDate = this.calender.getNext(this.fromDate, "d", 1);
    }
    let query = `?from=${JSON.stringify(this.fromDate)}&to=${JSON.stringify(
      this.toDate
    )}`;
    this.auth
      .getCollectorCollectionsHistoryWithQuery(this.User.phone, query)
      .subscribe(
        (res: any) => {
          this.matHist = res.history;
          this.historyLoading = false;
        },
        (err: any) => {
          this.historyLoading = false;
          console.log(err);
        }
      );
  }
}
