import { Component, OnInit, ViewChild } from '@angular/core';
import { NavService } from 'src/app/services/general/nav.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { EnvironmentService } from 'src/app/services/env/environment.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { WalletHistory } from 'src/app/interfaces/wallet-history';
import { WithdrawalHistory } from 'src/app/interfaces/withdrawal-history';

export interface User {
  id: string;
  producer_id: string;
  collector_id: string;
  materials: string;
  date: string;
  time: string;
  cost: string;
  payment_method: string;
}
@Component({
  selector: 'app-single-household',
  templateUrl: './single-household.component.html',
  styleUrls: ['./single-household.component.css'],
})
export class SingleHouseholdComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'producer_id',
    'collector_id',
    'materials',
    'cost',
    'payment_method',
    'time',
    'date',
  ];
  dataSource: MatTableDataSource<User>;
  walletColumns: string[] = ['amount', 'narration', 'type', 'date'];
  walletDebitColumns: string[] = ['amount', 'type', 'date'];
  walletHistoryDataSource: MatTableDataSource<WalletHistory>;
  walletDebitHistoryDataSource: MatTableDataSource<WithdrawalHistory>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSort, { static: true }) walletHistorySort: MatSort;
  @ViewChild(MatSort, { static: true }) walletDebitHistorySort: MatSort;
  @ViewChild('collHist') private collHist;

  constructor(
    private nav: NavService,
    private auth: AuthService,
    private router: Router,
    private modal: NgbModal,
    private calender: NgbCalendar
  ) {}

  edit = false;

  ngOnInit(): void {
    this.configureDate();
    this.populateUser();
  }

  User: any = { phone: '', userable: {} };
  Balance: any = '0.00';
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

  currentPage = 1;
  collectionSize = 0;
  pageSize = 1;

  walletHistoryCollection = [];
  walletHistoryCurrentPage = 1;
  walletHistoryCollectionSize = 0;
  walletHistoryPageSize = 1;

  walletDebitHistoryCollection = [];
  walletDebitHistoryCurrentPage = 1;
  walletDebitHistoryCollectionSize = 0;
  walletDebitHistoryPageSize = 1;

  configureDate() {
    this.fromDate = this.calender.getPrev(this.calender.getToday(), 'd', 6);
    this.maxDate = this.calender.getToday();
    this.toDate = this.calender.getToday();
  }

  populateUser() {
    if (this.nav.get() == null) {
      var id = this.router.url.split('_')[1];
      this.getSingleUser(id);
    } else {
      var id = this.router.url.split('_')[1];
      this.User = this.nav.get();
      this.getProducedTonnage(id);
      this.getProducedScrap(id);
      this.getWalletHistory(id);
      this.getWithdrawalHistory(id);
      this.dataSource = new MatTableDataSource(this.CollectedScrap);
      this.dataSource.sort = this.sort;
    }
  }

  getSingleUser(id) {
    this.auth.getUserWithID(id).subscribe(
      (res: any) => {
        this.User = res.data;
        this.getProducedTonnage(res.data.id);
        this.getProducedScrap(id);
        this.getWalletHistory(res.data.id);
        this.getWithdrawalHistory(res.data.id);
      },
      (error) => console.log(error)
    );
  }

  getProducedTonnage(id) {
    this.getCollectionshistory(id);
    this.getWalletBalance(id);
    this.loading = true;
    this.auth.getProducedTonnage(id).subscribe(
      (res: any) => {
        this.CollectedScrap = res.data;
        this.processTonnage();
      },
      (error) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  getWalletBalance(id) {
    this.auth.getwalletbalance(id).subscribe(
      (res: any) => (this.Balance = res.data.balance),
      (err) => console.log(err)
    );
  }

  getWalletHistory(id, query?) {
    query = query ? query + '&per_page=10' : '&per_page=10';
    this.auth.getWalletHistory(id, query).subscribe(
      (res: any) => this.handleWalletHistoryResponse(res),
      (err) => console.log(err)
    );
  }

  handleWalletHistoryResponse(res) {
    this.walletHistoryCollection = res.data;
    this.walletHistoryCurrentPage = res.current_page;
    this.walletHistoryCollectionSize = res.total;
    this.walletHistoryPageSize = res.per_page;
    this.walletHistoryDataSource = new MatTableDataSource(
      this.walletHistoryCollection
    );
    this.walletHistoryDataSource.sort = this.walletHistorySort;
  }

  getWithdrawalHistory(id, query?) {
    query = query ? query + '&per_page=10' : '&per_page=10';
    this.auth.getWithdrawalHistory(id, query).subscribe(
      (res: any) => this.handleWithdrawalHistoryResponse(res),
      (err) => console.log(err)
    );
  }

  handleWithdrawalHistoryResponse(res) {
    this.walletDebitHistoryCollection = res.data;
    this.walletDebitHistoryCurrentPage = res.current_page;
    this.walletDebitHistoryCollectionSize = res.total;
    this.walletDebitHistoryPageSize = res.per_page;
    this.walletDebitHistoryDataSource = new MatTableDataSource(
      this.walletDebitHistoryCollection
    );
    this.walletDebitHistoryDataSource.sort = this.walletDebitHistorySort;
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
    this.loading = false;
    return data;
  }

  // lineChart
  public lineChartData: Array<any> = [
    {
      data: [],
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

  formatMaterials(mat) {
    let materials = JSON.parse(mat);
    let matToShow = [];
    for (let m of materials) {
      matToShow.push(m.name);
    }
    return matToShow;
  }

  getProducedScrap(id, query?) {
    this.auth.getProducedScrap('households', id, query).subscribe(
      (res) => this.handleCollectionResponse(res),
      (err) => console.log(err)
    );
  }

  handleCollectionResponse(res) {
    this.Collections = res.data;
    this.currentPage = res.current_page;
    this.collectionSize = res.total;
    this.pageSize = res.per_page;
    this.dataSource = new MatTableDataSource(this.Collections);
    this.dataSource.sort = this.sort;
  }

  formatToCurrency(amount) {
    if (amount)
      return (
        '₦' +
        parseFloat(amount)
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$&,')
      );
  }

  selectTransaction(trans) {
    this.SelectedTransaction = trans;
  }

  evaluateMaterials(materials) {
    return JSON.parse(materials);
  }

  openCollHistModal() {
    this.modal.open(this.collHist, { centered: true, size: 'lg' });
  }

  getCollectionshistory(id) {
    this.historyLoading = true;
    this.auth.getScrapHistory(id).subscribe(
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
    this.auth.getSingleUserCollectionHistory(this.User.id, query).subscribe(
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

  changePage() {
    let query = `&page=${this.currentPage}`;
    this.getProducedScrap(this.User.id, query);
  }

  changeWalletHistoryPage() {
    let query = `&page=${this.walletHistoryCurrentPage}`;
    this.getWalletHistory(this.User.id, query);
  }

  changeWalletDebitHistoryPage() {
    let query = `&page=${this.walletDebitHistoryCurrentPage}`;
    this.getWithdrawalHistory(this.User.id, query);
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
