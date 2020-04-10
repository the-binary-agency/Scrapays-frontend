import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavService } from 'src/app/services/nav.service';
import { EnvironmentService } from 'src/app/services/environment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-single-listed-scrap',
  templateUrl: './single-listed-scrap.component.html',
  styleUrls: ['./single-listed-scrap.component.css']
})
export class SingleListedScrapComponent implements OnInit {
  @ViewChild('content') private content;
  URL = this.env.backendUrl;
  imageToBeExpanded: any;
  Items: any[] = [];
  itemCount: number;

  constructor ( private router: Router, private nav: NavService, private env: EnvironmentService, private modal: NgbModal, private api: ApiService ) { 
    
  }

  public Scrap: {
    firstName: string,
    lastName: string,
    phone: number,
    email: string,
    materialImages: [ ],
    materialLocation: string,
    materialDescription: [],
    created_at: string
  };

  ngOnInit(): void {
    this.populateScrap();
  }

  populateScrap() {
    var id = {id: this.getRouteId( this.router.url )};
    if ( this.nav.get() == null ) {
      this.getSingleScrap( id );
    } else {
      this.Scrap = this.nav.get(); 
      this.processScrapDescription();
    }
  }

  getSingleScrap( id ) {
    this.api.getSingleScrap( id ).subscribe( data => {
      data.map( list => {
        var images = JSON.parse( list.materialImages );
        var descriptions = JSON.parse( list.materialDescription );
        let lscrap = {
          id: list.id,
          firstName: list.firstName,
          lastName: list.lastName,
          phone: list.phone,
          email: list.email,
          materialImages: images,
          materialLocation: list.materialLocation,
          materialDescription: descriptions,
          created_at: list.created_at
        };

        this.Scrap = lscrap;
        this.processScrapDescription();
      } );
    } )
  }

  processScrapDescription() {
    var description = this.Scrap.materialDescription;
    var items = this.Items;
    for ( let i = 0; i < description.length; i++ ){
      let newitem = {
        'item' : '',
        'materialImages': [],
        'materialDescription': ''
      };
      items.push( newitem );
      items[ i ].description = description[ i ];
      items[ i ].item = 'Item ' + ( i + 1 );
    }
    this.itemCount = items.length;
    this.processScrapImage();
  }

  processScrapImage() {
    var images = this.Scrap.materialImages;
    var description = this.Scrap.materialDescription;
    var items = this.Items;
    for ( let i = 0; i < images.length; i++ ){
      let itemnumber = this.splitName( images[ i ] );
      for ( let ind = 0; ind < description.length; ind++ ) {
         if ( itemnumber == 'item ' + ( ind + 1 ) ) {
           items[ ind ].materialImages.push( images[ i ] );
          }
      }
    }
  }

  openModal( image ) {
    this.imageToBeExpanded = image;
    this.modal.open(this.content, { centered: true, size: 'xl' });
  }

  splitName( name ) {
    return name.split( '-' )[ 0 ];
  }

  getRouteId( route ) {
    return route.split( '_' )[ 1 ];
  }

}
