import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/auth/api.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-collector-dashboard',
  templateUrl: './collector-dashboard.component.html',
  styleUrls: ['./collector-dashboard.component.css']
})
export class CollectorDashboardComponent implements OnInit {
   @ViewChild('content') private content;
  Form: FormGroup;

  constructor ( private formBuilder: FormBuilder, private modal: NgbModal, private api: ApiService, private Token: TokenService, private Auth: AuthService, private token: TokenService ) {  
    this.getUser();
  }
  
 User: any = {
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    role: '',
    created_at: ""
 };
  Scrap: any = {
    metal:  0,
    aluminium:  0,
    plastic:  0,
    paper:  0,
    others:  0,
  }
  CollectedScrap: any = [];
  totalTonnage: number = 0;

  idValidation = [
    { type: 'required', message: 'A Producer ID is required.' },
    { type: 'minlength', message: 'Minimum of 6 characters' },
    { type: 'maxLength', message: 'Maximum of 6 characters' }
  ];
  public loading = false;
  modalTitle: string;
  modalBody: string;

  ngOnInit(): void {
    this.initForm();
  }

  
  getUser() {
    this.Auth.getUserWithTonnage( this.token.phone ).subscribe(
      (data : any) => {
        this.User = data.user;  
        this.CollectedScrap = data.tonnage
        this.processTonnage();
      },
      error => console.log(error),
    );      
  }


  processTonnage() {
    for ( let scrap of this.CollectedScrap ) {
      this.Scrap.metal += Number( scrap.metal )
      this.Scrap.aluminium += Number( scrap.aluminium )
      this.Scrap.paper += Number( scrap.paper )
      this.Scrap.plastic += Number( scrap.plastic )
      this.Scrap.others += Number( scrap.others )
      var temptotal = Number( scrap.metal ) + Number( scrap.aluminium ) + Number( scrap.plastic ) + Number( scrap.paper ) + Number( scrap.paper ); 
        this.totalTonnage += temptotal;       
    }

      this.lineChartData = [ {
      data: [
        this.round( ( this.Scrap.metal / this.totalTonnage ) * 100 ),
        this.round( ( this.Scrap.aluminium / this.totalTonnage ) * 100 ),
        this.round( ( this.Scrap.paper / this.totalTonnage ) * 100 ),
        this.round( ( this.Scrap.plastic / this.totalTonnage ) * 100 ),
        this.round( ( this.Scrap.others / this.totalTonnage ) * 100 ) ], label: "Scrap"
    } ];
    
  }

  initForm(){
    this.Form = this.formBuilder.group({
       producerID: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ])),
       metal: new FormControl(''),
      aluminium: new FormControl(''),
       paper: new FormControl(''),
      plastic: new FormControl(''),
       others: new FormControl(''),
  });
  }

  onSubmit( Form ) {
    this.loading = true;
    var scrap = this.processForm();
    this.api.uploadCollectedScrap( scrap ).subscribe(
      data => this.handleSuccess( data ),
      error => this.handleError( error )
    )
  }

  processForm() {
    const formData = new FormData();
    formData.append('collectorID', this.User.id);
    formData.append('role', this.User.role);
    formData.append('producerID', this.Form.get('producerID').value);
    formData.append('metal', this.Form.get('metal').value);
    formData.append( 'aluminium', this.Form.get( 'aluminium' ).value );
    formData.append( 'plastic', this.Form.get( 'plastic' ).value );
    formData.append( 'paper', this.Form.get( 'paper' ).value );
    formData.append( 'others', this.Form.get( 'others' ).value );

    return formData;
  }

  handleSuccess( data ) {
    this.modalTitle = "Success";
    this.modalBody ="Scrap Listed Successfully.";
    this.loading = false;
    this.openModal( this.content );
    this.Form.reset();
}

handleError( error ) {
  this.modalTitle = "Error";
  this.modalBody = error.error;
  this.loading = false;
  this.openModal(this.content);
}

openModal(content) {
  this.modal.open(content, { centered: true });
  }  
  
  round( value ) {
    return value.toFixed(2)
    // return Math.round( value );
  }

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  radioModel: string = "Month";

  // lineChart
  public lineChartData: Array<any> = [
    {
      data: [
        0,
        0,
        0,
        0,
        0], label: "Scrap"
    }
  ];

  public lineChartLabels: Array<any> = [
    "Metal",
    "Aluminium",
    "Paper",
    "Plastic",
    "Others"
  ];
  // public lineChartData: Array<any> = [
  //   { data: [65, 59, 80, 81, 56, 55, 40, 33, 45, 61, 11, 32], label: "Scrap" }
  // ];
  // public lineChartLabels: Array<any> = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December"
  // ];
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
