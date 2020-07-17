import { Component, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/auth/api.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { EnvironmentService } from 'src/app/services/env/environment.service';

@Component({
  selector: 'app-collector-dashboard',
  templateUrl: './collector-dashboard.component.html',
  styleUrls: ['./collector-dashboard.component.css']
})
export class CollectorDashboardComponent implements OnInit {
   @ViewChild('content') private content;
  Form: FormGroup;

  constructor ( private formBuilder: FormBuilder, private modal: NgbModal, private api: ApiService, private Token: TokenService, private Auth: AuthService, private token: TokenService, private auth: AuthService, private env: EnvironmentService ) {  
  }
  
  Cost = '₦0';
  tempCost = [];
 URL = this.env.backendUrl;
 User: any = {
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    role: '',
    created_at: ""
 };
  Scrap: any = {}
  CollectedScrap: any = [];
  listForm: any = [];
  producerPhone: string;
  totalTonnage: number = 0;
  producerName: string;
  nameloading = false;

  idValidation = [
    { type: 'required', message: 'A Producer ID is required.' },
    // { type: 'minlength', message: 'Minimum of 6 characters' },
  ];
  public loading = false;
  modalTitle: string;
  modalBody: string;
  materials = [];
  originalMaterials = [];
  displayedMaterials = [];
  collectionMaterials = [ ];

  ngOnInit(): void {
    this.getUser();
    this.getPrices();
  }

  
  getUser() {
    this.Auth.getCollectorWithTonnage( this.token.phone ).subscribe(
      (data : any) => {
        this.User = data.user;  
        this.CollectedScrap = data.tonnage;
        this.processTonnage();
      },
      error => console.log(error),
    );      
  }

  getScrap( data ) {
    this.CollectedScrap = data.tonnage;
    // // for ( let mat of data.tonnage ) {
    // //   this.CollectedScrap.push( JSON.parse( mat ) );
    // // }
    // var holder = {};

    // this.CollectedScrap.forEach(function(d) {
    //   if (holder.hasOwnProperty(d.name)) {
    //     holder[d.name] = holder[d.name] + d.weight;
    //   } else {
    //     holder[d.name] = d.weight;
    //   }
    // });

    // var obj2 = [];

    // for (var prop in holder) {
    //   obj2.push({ name: prop, weight: holder[prop] });
    // }
    // console.log(holder, obj2);
    
  }

  processTonnage() {
    for ( let scrap of this.CollectedScrap ) {
        this.totalTonnage += scrap.weight;       
    }
      this.lineChartData = [ {
      data: this.getSingleScrapForGraph(), label: "Scrap"
    } ];
    
  }

  getSingleScrapForGraph() {
    var data = [];
    var tonnage = this.totalTonnage;
    var label = this.lineChartLabels;
    var scrap = this.Scrap;
    this.CollectedScrap.forEach( function ( d ) {
      scrap[`${d.name}`] = [`${d.weight}`];
        label.push( d.name );
      var tonn = ( ( d.weight / tonnage ) * 100 ).toFixed( 2 );
      data.push( tonn );
    } )
    return data;
  }

  onSubmit( Form ) {
    this.loading = true;
    var form = this.processForm();
    this.api.listCollectedScrap( form ).subscribe(
      data => this.handleSuccess( data ),
      error => this.handleError( error )
    )
  }

  processForm() {
    const formData = {
      producerPhone: this.producerPhone,
      collectorID: this.token.phone,
      materials: this.collectionMaterials
    };

    return formData;
  }

  handleSuccess( data ) {
    this.modalTitle = "Success";
    this.modalBody ="Scrap Listed Successfully.";
    this.loading = false;
    this.openModal( this.content );
    this.resetCollectionMaterials();
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
  }

   roundToWhole( value ) {
    return Math.round( value );
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

  public lineChartLabels: Array<any> = [];
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
  
  displayMaterials() {
    for (let i = 0; i < this.materials.length; i++) {
      this.originalMaterials.push( this.materials[ i ] );
    }
    for ( let i = 0; i <= 3; i++){
      this.displayedMaterials.push( this.materials[ i ] );
    }
    this.materials.splice( 0, 4 );
  }
  
  addToDisplayedMaterials( material, i ) {
    this.materials.splice( i, 1 );
    this.materials.push(this.displayedMaterials[3] );
    this.displayedMaterials.splice( 3, 1 );
    this.displayedMaterials.unshift( material );
  }

  getDisplayedPrice( materialName ) {
    var display = this.Scrap[ materialName ] ? this.Scrap[ materialName ] : 0;
    return this.roundToWhole( display );
  }

    getPrices() {
      this.auth.getMaterialPrices( this.token.phone ).subscribe(
        ( data: any ) => {
          console.log( data.prices );
          for ( let price of data.prices ) {
            this.materials.push( price ); 
            var mat = { name: price.name, price: price.price, weight: '' };
            this.collectionMaterials.push( mat );
            this.tempCost.push( 0 );
          }
          this.displayMaterials();
          console.log("display ",this.materials);
          
      },
        error => console.log(error)
      )
    }
  
  PhoneOnFocusOut( event ) {
    this.nameloading = true;
    var form = {
      collectorID: this.token.phone,
      producerPhone: this.producerPhone,
    }
    this.auth.getUserName( form ).subscribe(
      ( data: any ) => {
        this.producerName = data.Name;
        this.nameloading = false;
     },
      error => {
        console.log(error)
        this.nameloading = false;
      }
    )
  }

  weightChange( event: any, i ) {
    this.tempCost[ i ] = this.originalMaterials[ i ].price * event.target.value;

     var sum = this.tempCost.reduce(function(a, b){
        return a + b;
     }, 0 );
    
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
    });

    this.Cost = "₦" + sum.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    
  }

  resetCollectionMaterials() {
    for ( let mat of this.collectionMaterials ) {
      mat.weight = ''
    }
    this.Cost = '₦0';
  }
  
  addBorder( i ) {
    var classes = {};
    if ( i == 0 || i == 2 ) {
      classes['border-right'] = true
    }
    if ( i == 0 || i == 1 ) {
      classes['border-bottom'] = true
    }
    return classes;
  }

}
