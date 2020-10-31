import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { TokenService } from 'src/app/services/auth/token.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EnvironmentService } from 'src/app/services/env/environment.service';

@Component({
  selector: 'app-collector-dashboard',
  templateUrl: './collector-dashboard.component.html',
  styleUrls: ['./collector-dashboard.component.css'],
})
export class CollectorDashboardComponent implements OnInit {
  @ViewChild('collHist') private collHist;
  constructor(
    private modal: NgbModal,
    private Auth: AuthService,
    private token: TokenService,
    private env: EnvironmentService,
    private calender: NgbCalendar
  ) {}

  URL = this.env.backendUrl;
  User: any = {
    id: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    role: '',
    created_at: '',
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

  model: NgbDateStruct;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  maxDate: NgbDateStruct;

  ngOnInit(): void {
    this.configureDate();
    this.getUser();
    this.getPrices();
    this.getCollectionshistory();
  }

  initiateTracking() {
    if ('geolocation' in navigator) {
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

  configureDate() {
    this.fromDate = this.calender.getPrev(this.calender.getToday(), 'd', 6);
    this.maxDate = this.calender.getToday();
    this.toDate = this.calender.getToday();
  }

  getUser() {
    this.Auth.getLoggedInUser().subscribe(
      (res: any) => {
        this.User = res.data;
        this.getTonnage();
      },
      (error) => console.log(error)
    );
  }

  getTonnage() {
    this.Auth.getCollectedTonnage(this.token._id).subscribe(
      (res: any) => {
        this.initiateTracking();
        this.CollectedScrap = res.data;
        this.processTonnage();
      },
      (error) => console.log(error)
    );
  }

  getPrices() {
    this.Auth.getMaterialPrices(this.token._id).subscribe(
      (res: any) => {
        for (let price of res.data) {
          this.materials.push(price);
        }
        this.materials.push({
          id: 500,
          name: 'Composite',
          image: 'composite-icon.png',
        });
        this.displayMaterials();
      },
      (error) => console.log(error)
    );
  }

  processTonnage() {
    for (let scrap of this.CollectedScrap) {
      this.totalTonnage += scrap.weight;
    }
    this.lineChartData = [
      {
        data: this.getSingleScrapForGraph(),
        label: 'Scrap',
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

  radioModel: string = 'Month';

  // lineChart
  public lineChartData: Array<any> = [
    {
      data: [0, 0, 0, 0, 0],
      label: 'Scrap',
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
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
    {
      // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)',
    },
    {
      // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

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
      classes['border-right'] = true;
    }
    if (i == 0 || i == 1) {
      classes['border-bottom'] = true;
    }
    return classes;
  }

  openCollHistModal() {
    this.modal.open(this.collHist, { centered: true, size: 'lg' });
  }

  getCollectionshistory() {
    this.historyLoading = true;
    this.Auth.getSingleUserCollectionHistory(this.token._id).subscribe(
      (res: any) => {
        this.matHist = res.data;
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
        .replace(/\d(?=(\d{3})+\.)/g, '$&,');
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

  getHistory(from, to) {
    this.historyLoading = true;
    let query = `from=${JSON.stringify(from)}&to=${JSON.stringify(to)}`;
    this.Auth.getSingleUserCollectionHistory(this.User.id, query).subscribe(
      (res: any) => {
        this.matHist = res.data;
        this.historyLoading = false;
      },
      (err: any) => {
        this.historyLoading = false;
        console.log(err);
      }
    );
  }

  filterByDate() {
    this.historyLoading = true;
    if (this.toDate == null) {
      this.toDate = this.calender.getNext(this.fromDate, 'd', 1);
    } else {
      this.toDate = this.calender.getNext(this.toDate, 'd', 1);
    }
    this.getHistory(this.fromDate, this.toDate);
  }

  selectSort(e) {
    switch (e.target.value) {
      case 'week':
        this.getWeeklyHistory();
        break;
      case 'month':
        this.getMonthlyHistory();
        break;
      case 'year':
        this.getYearlyHistory();
        break;
      default:
        break;
    }
  }

  getWeeklyHistory() {
    let today = this.calender.getToday();
    let currentWeekDay = this.calender.getWeekday(today);
    let Mon = this.calender.getPrev(today, 'd', currentWeekDay - 1);
    let Sat = this.calender.getNext(today, 'd', 6 - currentWeekDay + 1);
    this.getHistory(Mon, Sat);
  }

  getMonthlyHistory() {
    let today = this.calender.getToday();
    let endOfLastMonth = this.calender.getPrev(today, 'm', 1);
    let endOfNextMonth = this.calender.getNext(today, 'm', 1);
    let startOfNextMonth = this.calender.getPrev(
      endOfNextMonth,
      'd',
      endOfNextMonth.day - 1
    );
    this.getHistory(endOfLastMonth, startOfNextMonth);
  }

  getYearlyHistory() {
    let today = this.calender.getToday();
    let endOfLastYear = { year: today.year - 1, month: 11, day: 31 };
    let startOfNextYear = { year: today.year + 1, month: 0, day: 1 };
    this.getHistory(endOfLastYear, startOfNextYear);
  }
}
