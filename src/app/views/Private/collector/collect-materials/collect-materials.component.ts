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
  producerName: string = null;
  registerNew = false;
  newProducer = {
    firstName: "",
    lastName: "",
  };
  loc = {
    lat: 0,
    lng: 0,
  };
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
    { name: null, price: "0.00", cost: "0.00", weight: "0.00" },
  ];
  materialSelect: string = null;

  ngOnInit(): void {
    this.initiateTracking();
    this.getPrices();
    this.getAssignedRequests();
  }

  getPrices() {
    this.Auth.getMaterialPrices(this.token.phone).subscribe(
      (data: any) => {
        for (let price of data.prices) {
          this.materials.push(price);
        }
        this.materials.push({
          id: 500,
          name: "Composite",
          price: 0.0,
          cost: 0.0,
          weight: 0.0,
        });
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

  initiateTracking() {
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition((position) => {
        this.loc.lat = position.coords.latitude;
        this.loc.lng = position.coords.longitude;
      });
    }
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
    let tempCost = 0;
    let temptotal = 0;
    let tempTotalTonnage = 0;

    if (selected.name == "Composite") {
      if (weight) {
        tempCost += parseFloat(weight);
      } else {
        tempCost = parseFloat("0.00");
        weight = "0";
      }
    } else {
      if (weight) {
        tempCost = parseFloat(selected.price) * parseFloat(weight);
      } else {
        tempCost = parseFloat(selected.price) * parseFloat("0.00");
      }
    }
    selected.cost = tempCost.toString();

    for (let coll of this.collectionMaterials) {
      console.log(coll.cost);

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

  cashFormValidated() {
    if (this.registerNew) {
      for (let mat of this.collectionMaterials) {
        if (mat.name == "" || mat.weight == "" || mat.weight == "0.00") {
          return false;
        }
      }
      if (this.newProducer.firstName == "" || this.newProducer.lastName == "") {
        return false;
      }
      return true;
    } else {
      if (this.producerName == null) {
        return false;
      }
      for (let mat of this.collectionMaterials) {
        if (mat.name == "Composite") {
          if (mat.name == "" || mat.cost == "" || mat.cost == "0") {
            return false;
          }
        } else {
          if (mat.name == "" || mat.weight == "" || mat.weight == "0.00") {
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
      if (this.producerName == null) {
        return false;
      }
      for (let mat of this.collectionMaterials) {
        if (mat.name == "Composite") {
          if (mat.name == "" || mat.cost == "" || mat.cost == "0") {
            return false;
          }
        } else {
          if (mat.name == "" || mat.weight == "" || mat.weight == "0.00") {
            return false;
          }
        }
      }
      return true;
    }
  }

  payWithCash() {
    this.loading = true;
    var form: any = this.processForm("Cash");
    this.Auth.getAddressWithCoordinates(JSON.stringify(this.loc)).subscribe(
      (res: any) => {
        if (this.registerNew) {
          form.newUser.requestAddress = res.address;
        } else {
          form.requestAddress = res.address;
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
    var form: any = this.processForm("Wallet");
    this.Auth.getAddressWithCoordinates(JSON.stringify(this.loc)).subscribe(
      (res: any) => {
        if (this.registerNew) {
          form.newUser.requestAddress = res.address;
        } else {
          form.requestAddress = res.address;
        }
        this.api.listCollectedScrap(form).subscribe(
          (data) => this.handleSuccess(data),
          (error) => this.handleError(error)
        );
      },
      (err) => this.handleError(err)
    );
  }

  clearProducer() {
    this.producerName = null;
    this.producerPhone = "";
    this.newProducer = {
      firstName: "",
      lastName: "",
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
        producerPhone: this.producerPhone,
        collectorID: this.token.phone,
        materials: this.collectionMaterials,
        totalCost: this.totalCost,
        totalTonnage: this.totalTonnage,
        pickupID: this.pickupID,
        requestAddress: "",
      };
      return formData;
    } else {
      let formData = {
        mode: mode,
        producerPhone: this.producerPhone,
        collectorID: this.token.phone,
        materials: this.collectionMaterials,
        totalCost: this.totalCost,
        totalTonnage: this.totalTonnage,
        pickupID: this.pickupID,
        newUser: {
          firstName: this.newProducer.firstName,
          lastName: this.newProducer.lastName,
          phone: this.producerPhone,
          requestAddress: "",
        },
      };
      return formData;
    }
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
