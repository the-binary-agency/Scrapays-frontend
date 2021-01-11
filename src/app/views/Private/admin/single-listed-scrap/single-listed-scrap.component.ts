import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavService } from 'src/app/services/general/nav.service';
import { EnvironmentService } from 'src/app/services/env/environment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-single-listed-scrap',
  templateUrl: './single-listed-scrap.component.html',
  styleUrls: ['./single-listed-scrap.component.css'],
})
export class SingleListedScrapComponent implements OnInit {
  @ViewChild('content') private content;
  URL = this.env.backendUrl;
  imageToBeExpanded: any;
  Items: any[] = [];
  itemCount: number;

  constructor(
    private router: Router,
    private nav: NavService,
    private env: EnvironmentService,
    private modal: NgbModal,
    private auth: AuthService
  ) {}

  public Scrap: {
    first_name: string;
    last_name: string;
    phone: number;
    email: string;
    material_images: [];
    material_location: string;
    material_description: [];
    created_at: string;
  };

  ngOnInit(): void {
    this.populateScrap();
  }

  populateScrap() {
    var id = this.getRouteId(this.router.url);
    if (this.nav.get() == null) {
      this.getSingleScrap(id);
    } else {
      this.Scrap = this.nav.get();
      this.processScrapDescription();
    }
  }

  getSingleScrap(id) {
    this.auth.getSingleScrap(id).subscribe(
      (res: any) => {
        var images = JSON.parse(res.data.material_images);
        var descriptions = JSON.parse(res.data.material_description);
        let lscrap = {
          id: res.data.id,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          phone: res.data.phone,
          email: res.data.email,
          material_images: images,
          material_location: res.data.material_location,
          material_description: descriptions,
          created_at: res.data.created_at,
        };

        this.Scrap = lscrap;
        this.processScrapDescription();
      },
      (err) => console.log(err)
    );
  }

  processScrapDescription() {
    var description = this.Scrap.material_description;
    var items = this.Items;
    for (let i = 0; i < description.length; i++) {
      let newitem = {
        item: '',
        material_images: [],
        materialDescription: '',
      };
      items.push(newitem);
      items[i].description = description[i];
      items[i].item = 'Item ' + (i + 1);
    }
    this.itemCount = items.length;
    this.processScrapImage();
  }

  processScrapImage() {
    var images = this.Scrap.material_images;
    var description = this.Scrap.material_description;
    var items = this.Items;
    for (let i = 0; i < images.length; i++) {
      let itemnumber = this.splitName(images[i]);
      for (let ind = 0; ind < description.length; ind++) {
        if (itemnumber == 'item ' + (ind + 1)) {
          items[ind].material_images.push(images[i]);
        }
      }
    }
  }

  openModal(image) {
    this.imageToBeExpanded = image;
    this.modal.open(this.content, { centered: true, size: 'xl' });
  }

  splitName(name) {
    return name.split('-')[0];
  }

  getRouteId(route) {
    return route.split('_')[1];
  }
}
