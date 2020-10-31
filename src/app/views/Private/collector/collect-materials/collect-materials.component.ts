import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/auth/api.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-collect-materials',
  templateUrl: './collect-materials.component.html',
  styleUrls: ['./collect-materials.component.css'],
})
export class CollectMaterialsComponent implements OnInit {
  constructor(
    private modal: NgbModal,
    private api: ApiService,
    private Auth: AuthService,
    private token: TokenService
  ) {}

  @ViewChild('content') private content;
  Form: FormGroup;

  total_cost = '0.00';
  total_tonnage = '0.00';
  producer_name: string = null;
  producer_id = '';
  registerNew = false;
  newProducer = {
    first_name: '',
    last_name: '',
  };
  loc = {
    lat: 0,
    lng: 0,
  };
  pickup_id: string;
  nameloading = false;
  Scrap: any = {};
  CollectedScrap: any = [];
  producer_phone: string;
  nameError: string = '';

  public loading = false;
  modalTitle: string;
  modalBody: string;
  materials = [];
  assignedRequests = [];
  collectionMaterials = [
    { name: null, price: '0.00', cost: '0.00', weight: '0.00' },
  ];
  materialSelect: string = null;

  ngOnInit(): void {
    this.initiateTracking();
    this.getPrices();
    this.getAssignedRequests();
  }

  getPrices() {
    let query = 'per_page=50';
    this.Auth.getMaterialPrices(query).subscribe(
      (res: any) => {
        for (let price of res.data) {
          this.materials.push(price);
        }
        this.materials.push({
          id: 500,
          name: 'Composite',
          price: 0.0,
          cost: 0.0,
          weight: 0.0,
          comment: '',
        });
      },
      (error) => console.log(error)
    );
  }

  getAssignedRequests() {
    this.Auth.getAssignedRequests(this.token._id).subscribe(
      (res: any) => {
        this.assignedRequests = res.data;
      },
      (error) => console.log(error)
    );
  }

  initiateTracking() {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition((position) => {
        this.loc.lat = position.coords.latitude;
        this.loc.lng = position.coords.longitude;
      });
    }
  }

  PhoneOnFocusOut(event) {
    if (this.producer_phone != '') {
      this.nameloading = true;
      this.Auth.getUserName(this.producer_phone).subscribe(
        (res: any) => {
          this.producer_name = res.data.Name;
          this.producer_id = res.data.producer_id;
          this.pickup_id = res.data.pickup_id;
          this.nameloading = false;
          this.nameError = null;
        },
        (error) => {
          this.nameError = error.error.error;
          this.nameloading = false;
        }
      );
    }
  }

  weightChange(weight: any, i) {
    let selected = this.collectionMaterials[i];
    let tempCost = 0;
    let temptotal = 0;
    let tempTotalTonnage = 0;

    if (selected.name == 'Composite') {
      if (weight) {
        tempCost += parseFloat(weight);
      } else {
        tempCost = parseFloat('0.00');
        weight = '0';
      }
    } else {
      if (weight) {
        tempCost = parseFloat(selected.price) * parseFloat(weight);
      } else {
        tempCost = parseFloat(selected.price) * parseFloat('0.00');
      }
    }
    selected.cost = tempCost.toFixed(2);

    for (let coll of this.collectionMaterials) {
      temptotal += parseFloat(coll.cost);
      tempTotalTonnage += parseFloat(coll.weight);
    }
    this.total_cost = temptotal.toFixed(2);
    this.total_tonnage = tempTotalTonnage.toFixed(2);
  }

  formatToCurrency(amount) {
    if (amount)
      return parseFloat(amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  onSelectMaterial(event: any, i) {
    let selected = this.collectionMaterials[i];
    selected.name = event.target.value;
    for (let mat of this.materials) {
      if (mat.name == event.target.value) selected.price = mat.price;
    }
    this.weightChange(selected.weight, i);
  }

  addToCollectionMaterial() {
    var mat = { name: null, price: '', cost: '0.00', weight: '0.00' };
    this.collectionMaterials.push(mat);
  }

  onRemoveMaterial(i) {
    this.collectionMaterials.splice(i, 1);
  }

  cashFormValidated() {
    if (this.registerNew) {
      for (let mat of this.collectionMaterials) {
        if (mat.name == '' || mat.weight == '' || mat.weight == '0.00') {
          return false;
        }
      }
      if (
        this.newProducer.first_name == '' ||
        this.newProducer.last_name == ''
      ) {
        return false;
      }
      return true;
    } else {
      if (this.producer_name == null) {
        return false;
      }
      for (let mat of this.collectionMaterials) {
        if (mat.name == 'Composite') {
          if (mat.name == '' || mat.cost == '' || mat.cost == '0') {
            return false;
          }
        } else {
          if (mat.name == '' || mat.weight == '' || mat.weight == '0.00') {
            return false;
          }
        }
      }
      return true;
    }
  }

  walletFormValidated() {
    if (this.registerNew) {
      return false;
    } else {
      if (this.producer_name == null) {
        return false;
      }
      for (let mat of this.collectionMaterials) {
        if (mat.name == 'Composite') {
          if (mat.name == '' || mat.cost == '' || mat.cost == '0') {
            return false;
          }
        } else {
          if (mat.name == '' || mat.weight == '' || mat.weight == '0.00') {
            return false;
          }
        }
      }
      return true;
    }
  }

  payWithCash() {
    this.loading = true;
    var form: any = this.processForm('Cash');
    let loc = `lat=${this.loc.lat}&lng=${this.loc.lng}`;
    this.Auth.getAddressWithCoordinates(loc).subscribe(
      (res: any) => {
        if (this.registerNew) {
          form.newUser.request_address = res.data;
        } else {
          form.request_address = res.data;
        }
        this.api.listCollectedScrap(form).subscribe(
          (data) => this.handleSuccess(data),
          (error) => this.handleError(error)
        );
      },
      (err) => this.handleError(err)
    );
  }
  payWithWallet() {
    this.loading = true;
    var form: any = this.processForm('Wallet');
    let loc = `lat=${this.loc.lat}&lng${this.loc.lng}`;
    this.Auth.getAddressWithCoordinates(loc).subscribe(
      (res: any) => {
        if (this.registerNew) {
          form.newUser.request_address = res.data;
        } else {
          form.request_address = res.data;
        }
        this.api.listCollectedScrap(form).subscribe(
          (res) => this.handleSuccess(res),
          (err) => this.handleError(err)
        );
      },
      (err) => this.handleError(err)
    );
  }

  clearProducer() {
    this.producer_name = null;
    this.producer_phone = '';
    this.newProducer = {
      first_name: '',
      last_name: '',
    };
    this.loc = {
      lat: 0,
      lng: 0,
    };
  }

  processForm(mode: string) {
    if (this.registerNew == false) {
      const formData = {
        mode: mode,
        producer_phone: this.producer_phone,
        producer_id: this.producer_id,
        collector_id: this.token._id,
        materials: this.collectionMaterials,
        total_cost: this.total_cost,
        total_tonnage: this.total_tonnage,
        pickup_id: this.pickup_id,
        request_address: '',
      };
      return formData;
    } else {
      let formData = {
        mode: mode,
        producer_phone: this.producer_phone,
        producer_id: this.producer_id,
        collector_id: this.token._id,
        materials: this.collectionMaterials,
        total_cost: this.total_cost,
        total_tonnage: this.total_tonnage,
        pickup_id: this.pickup_id,
        newUser: {
          first_name: this.newProducer.first_name,
          last_name: this.newProducer.last_name,
          phone: this.producer_phone,
          request_address: '',
        },
      };
      return formData;
    }
  }

  handleSuccess(data) {
    this.modalTitle = 'Success';
    this.modalBody = 'Scrap Listed Successfully.';
    this.loading = false;
    this.openModal(this.content);
    this.resetCollectionMaterials();
  }

  handleError(error) {
    this.modalTitle = 'Error';
    this.modalBody = error.error.error;
    this.loading = false;
    this.openModal(this.content);
  }

  resetCollectionMaterials() {
    this.clearProducer();
    this.collectionMaterials = [
      { name: null, price: '', cost: '0.00', weight: '0.00' },
    ];
    this.total_cost = '0.00';
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }

  formatMaterials(mat) {
    return JSON.parse(mat);
  }

  formatSchedule(sch) {
    let schedule = JSON.parse(sch);
    return (
      schedule.schedule_time +
      ' | ' +
      schedule.schedule_date.day +
      '-' +
      schedule.schedule_date.month +
      '-' +
      schedule.schedule_date.year
    );
  }
}
