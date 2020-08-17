import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApiService } from "src/app/services/auth/api.service";
import { TokenService } from "src/app/services/auth/token.service";
import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-collect-materials",
  templateUrl: "./collect-materials.component.html",
  styleUrls: ["./collect-materials.component.css"],
})
export class CollectMaterialsComponent implements OnInit {
  constructor(
    private modal: NgbModal,
    private api: ApiService,
    private Auth: AuthService,
    private token: TokenService
  ) {}

  @ViewChild("content") private content;
  Form: FormGroup;

  totalCost = "0.00";
  totalTonnage = "0.00";
  producerName: string;
  pickupID: string;
  nameloading = false;
  Scrap: any = {};
  CollectedScrap: any = [];
  producerPhone: string;
  nameError: string = "";

  public loading = false;
  modalTitle: string;
  modalBody: string;
  materials = [];
  assignedRequests = [];
  collectionMaterials = [
    { name: null, price: "", cost: "0.00", weight: "0.00" },
  ];
  materialSelect: string = null;

  ngOnInit(): void {
    this.getPrices();
    this.getAssignedRequests();
  }

  getPrices() {
    this.Auth.getMaterialPrices(this.token.phone).subscribe(
      (data: any) => {
        for (let price of data.prices) {
          this.materials.push(price);
        }
      },
      (error) => console.log(error)
    );
  }

  getAssignedRequests() {
    this.Auth.getAssignedRequests(this.token.phone).subscribe(
      (data: any) => {
        this.assignedRequests = data.pickups;
      },
      (error) => console.log(error)
    );
  }

  PhoneOnFocusOut(event) {
    if (this.producerPhone != "") {
      this.nameloading = true;
      var form = {
        collectorID: this.token.phone,
        producerPhone: this.producerPhone,
      };
      this.Auth.getUserName(form).subscribe(
        (data: any) => {
          this.producerName = data.Name;
          this.pickupID = data.pickupID;
          this.nameloading = false;
          this.nameError = null;
        },
        (error) => {
          this.nameError = error.error.Name;
          this.nameloading = false;
        }
      );
    }
  }

  weightChange(weight: any, i) {
    let selected = this.collectionMaterials[i];
    let tempPrice: number;

    if (weight) {
      tempPrice = parseFloat(selected.price) * parseFloat(weight);
    } else {
      tempPrice = parseFloat(selected.price) * parseFloat("0");
    }
    let rawCost = tempPrice.toString();
    selected.cost = rawCost;

    let temptotal = 0;
    let tempTotalTonnage = 0;
    for (let coll of this.collectionMaterials) {
      temptotal += parseFloat(coll.cost);
      tempTotalTonnage += parseFloat(coll.weight);
    }

    this.totalCost = temptotal.toString();
    this.totalTonnage = tempTotalTonnage.toString();
  }

  formatToCurrency(amount) {
    if (amount)
      return parseFloat(amount)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,");
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
    var mat = { name: null, price: "", cost: "0.00", weight: "0.00" };
    this.collectionMaterials.push(mat);
  }

  onRemoveMaterial(i) {
    this.collectionMaterials.splice(i, 1);
  }

  formValidated() {
    if (this.producerName == null) {
      return false;
    }
    for (let mat of this.collectionMaterials) {
      if (mat.name == "" || mat.weight == "") {
        return false;
      }
    }
    return true;
  }

  payWithCash() {
    this.loading = true;
    var form = this.processForm("Cash");
    this.api.listCollectedScrap(form).subscribe(
      (data) => this.handleSuccess(data),
      (error) => this.handleError(error)
    );
  }
  payWithWallet() {
    this.loading = true;
    var form = this.processForm("Wallet");
    this.api.listCollectedScrap(form).subscribe(
      (data) => this.handleSuccess(data),
      (error) => this.handleError(error)
    );
  }

  clearProducer() {
    this.producerName = "";
    this.producerPhone = "";
  }

  processForm(mode: string) {
    const formData = {
      mode: mode,
      producerPhone: this.producerPhone,
      collectorID: this.token.phone,
      materials: this.collectionMaterials,
      totalCost: this.totalCost,
      totalTonnage: this.totalTonnage,
      pickupID: this.pickupID,
    };

    return formData;
  }

  handleSuccess(data) {
    this.modalTitle = "Success";
    this.modalBody = "Scrap Listed Successfully.";
    this.loading = false;
    this.openModal(this.content);
    this.resetCollectionMaterials();
  }

  handleError(error) {
    this.modalTitle = "Error";
    this.modalBody = error.error;
    this.loading = false;
    this.openModal(this.content);
  }

  resetCollectionMaterials() {
    this.clearProducer();
    this.collectionMaterials = [
      { name: null, price: "", cost: "0.00", weight: "0.00" },
    ];
    this.totalCost = "0.00";
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
      schedule.scheduleTime +
      " | " +
      schedule.scheduleDate.day +
      "-" +
      schedule.scheduleDate.month +
      "-" +
      schedule.scheduleDate.year
    );
  }
}
