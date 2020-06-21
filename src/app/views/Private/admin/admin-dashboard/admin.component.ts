import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/auth/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/auth/token.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  @ViewChild('content') private content;
  Form: FormGroup;
  
  constructor(private formBuilder: FormBuilder, private api: ApiService, private modal: NgbModal, private Auth: AuthService, private token: TokenService) { }

  ngOnInit(): void {
    this.initForm();
    this.getUserCount();
    this.getPrices();
  }

  public loading = false;
  modalTitle: string;
  modalBody: string;
  edit = false;
  adding = false;
  lastUpdated: any;
  UserCount: any = {
    producers: 0,
    vendors: 0,
    collectors: 0
  }
  materialPrices: any[] = [];
  newMaterial: any = [];

//  lineChart
  public lineChartData: Array<any> = [
    {
      data: [
        50,
        150,
        60,
        140], label: "Listing Deals Done"
    }
  ];

  public lineChartLabels: Array<any> = [
    "1 Dec",
    "8 Dec",
    "18 Dec",
    "31 Dec"
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

  public doughnutChartLabels = ['In Progress', 'New Listing', 'Completed'];
  public doughnutChartData = [120, 150, 180];
  public doughnutChartType = 'doughnut';
  public doughnutChartColors: Array<any> = [
    {
      backgroundColor: ["rgba(240, 255, 0, 1)", 'rgba(0, 230, 64, 1)', 'rgba(207, 0, 15, 1)'],
    }
  ];
  public doughnutChartOptions = { 
    legend: { position: 'right' }
  };

  initForm(){
    this.Form = this.formBuilder.group({
       metal: new FormControl('', Validators.compose([
        Validators.required
      ])),
      aluminium: new FormControl('', Validators.compose([
        Validators.required
      ])),
       paper: new FormControl('', Validators.compose([
        Validators.required
      ])),
      plastic: new FormControl('', Validators.compose([
        Validators.required
      ])),
       others: new FormControl('', Validators.compose([
        Validators.required
      ])),
  });
  }

  onSubmit( ) {
    var form = this.processFormData();
    this.loading = true;
    this.Auth.setMaterialPrices( this.token.phone, form).subscribe(
      data => this.handleSuccess( data ),
      error => this.handleError( error )
    )
  }

  getPrices() {
    this.Auth.getMaterialPrices( this.token.phone ).subscribe(
      ( data: any ) => {
        if (data.prices) {
          this.materialPrices = data.prices;
          this.newMaterial = [];
          this.adding = false;
        }
      },
      error => console.log( error )
    )
  }

  handleSuccess( data ) {
    this.modalTitle = "Success";
    this.modalBody = data.message;
    this.loading = false;
    this.getPrices();
    this.edit = false;
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

  getUserCount() {
    this.Auth.getUserCount( this.token.phone ).subscribe(
      data => {
        this.UserCount = data;
        this.lastUpdated = new Date().toISOString();
      },
      error => console.log(error)
    )
  }

  onFileInput(ev: any, i: any){
    let file = ev.target.files[0];
    
    this.materialPrices[ i ].image = file;
  }

  onNewFileInput(ev: any, i: any){
    let file = ev.target.files[0];
    this.newMaterial[ i ].image = file;
  }
  
  addMaterial() {
    this.adding = true;
    var mat = {
      name: 'New Material',
      price: 0, 
      image: ''
    }
    this.newMaterial.push( mat );
  }

  removeMaterial( i ) {
    this.materialPrices.splice( i, 1 );
  }

  processFormData() {
    const formData = new FormData();
    for ( var i = 0; i < this.newMaterial.length; i++ ){
        formData.append(`material_name[]`, this.newMaterial[i].name);
        formData.append(`material_price[]`, this.newMaterial[i].price);
        formData.append(`material_img[]`, this.newMaterial[i].image, 'material-' + ( i + 1 )  + '-' + this.newMaterial[i].image.name );
    }

    return formData;
  }

  isString(val): boolean { return typeof val === 'string'; }

}
