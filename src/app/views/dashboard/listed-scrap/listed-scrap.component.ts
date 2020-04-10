import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Scrap } from  '../../../models/scrap';
import { Router } from '@angular/router';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-listed-scrap',
  templateUrl: './listed-scrap.component.html',
  styleUrls: ['./listed-scrap.component.css']
})
export class ListedScrapComponent implements OnInit {

  constructor(private listed: ApiService, private router: Router, private nav: NavService) { }

  ngOnInit(): void {
    this.getAllListedSrap();
  }

  ListedScraps: any[] = [];
  MaterialDescriptions: any[] = [];

  getAllListedSrap() {
    this.listed.getListedScrap().subscribe(
      data => {
        console.log( data );
        
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
          this.ListedScraps.push( lscrap );
        
        })
      }
    )
  }

  gotoSingle( listedscrap ) {
    this.nav.navigate('/dashboard/listedScrap/scrap_' + listedscrap.id, listedscrap)
  }

}
