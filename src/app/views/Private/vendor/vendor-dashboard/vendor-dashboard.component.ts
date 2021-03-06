import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css'],
})
export class VendorDashboardComponent implements OnInit {
  constructor(
    private modal: NgbModal,
    private token: TokenService,
    private Token: TokenService,
    private Auth: AuthService
  ) {}

  User: any = {
    id: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    role: '',
    created_at: '',
  };
  Scrap: any = {
    metal: 0,
    aluminium: 0,
    plastic: 0,
    paper: 0,
    others: 0,
  };
  CollectedScrap: any = [];
  totalTonnage: number = 0;
  loading: boolean;

  ngOnInit(): void {
    this.getUser();
  }

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  radioModel: string = 'Month';

  getUser() {
    this.loading = true;
    this.Auth.getLoggedInUser().subscribe(
      (res: any) => {
        this.User = res.data;
        this.getTonnage();
      },
      (err) => {
        this.loading = false;
        console.log(err);
      }
    );
  }

  getTonnage() {
    this.Auth.getProducedTonnage(this.token._id).subscribe(
      (res: any) => {
        this.CollectedScrap = res.data;
        this.processTonnage();
      },
      (error) => console.log(error)
    );
  }

  processTonnage() {
    for (let scrap of this.CollectedScrap) {
      this.Scrap.metal += Number(scrap.metal);
      this.Scrap.aluminium += Number(scrap.aluminium);
      this.Scrap.paper += Number(scrap.paper);
      this.Scrap.plastic += Number(scrap.plastic);
      this.Scrap.others += Number(scrap.others);
      var temptotal =
        Number(scrap.metal) +
        Number(scrap.aluminium) +
        Number(scrap.plastic) +
        Number(scrap.paper) +
        Number(scrap.paper);
      this.totalTonnage += temptotal;
    }

    this.lineChartData = [
      {
        data: [
          this.round((this.Scrap.metal / this.totalTonnage) * 100),
          this.round((this.Scrap.aluminium / this.totalTonnage) * 100),
          this.round((this.Scrap.paper / this.totalTonnage) * 100),
          this.round((this.Scrap.plastic / this.totalTonnage) * 100),
          this.round((this.Scrap.others / this.totalTonnage) * 100),
        ],
        label: 'Scrap',
      },
    ];
  }

  round(value) {
    return value.toFixed(2);
    // return Math.round( value );
  }

  // lineChart
  public lineChartData: Array<any> = [
    {
      data: [0, 0, 0, 0, 0],
      label: 'Scrap',
    },
  ];

  public lineChartLabels: Array<any> = [
    'Metal',
    'Aluminium',
    'Paper',
    'Plastic',
    'Others',
  ];
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
}
