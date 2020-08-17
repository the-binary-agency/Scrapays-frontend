import { Component, OnInit, ViewChild } from "@angular/core";
import { TokenService } from "src/app/services/auth/token.service";
import { AuthService } from "src/app/services/auth/auth.service";
import { EnvironmentService } from "src/app/services/env/environment.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-edit-materials",
  templateUrl: "./edit-materials.component.html",
  styleUrls: ["./edit-materials.component.css"],
})
export class EditMaterialsComponent implements OnInit {
  @ViewChild("content") private content;

  constructor(
    private token: TokenService,
    private Auth: AuthService,
    private env: EnvironmentService,
    private modal: NgbModal
  ) {}

  URL = this.env.backendUrl;
  modalTitle: string;
  modalBody: string;
  materialPrices: any[] = [];
  editedMaterials: any = [];
  matForm = {
    id: "",
    name: "",
    price: "",
  };
  newMatImage: any = { name: "", type: "test" };
  loading = false;
  edit = false;

  ngOnInit(): void {
    this.getPrices();
  }

  getPrices() {
    this.Auth.getMaterialPrices(this.token.phone).subscribe(
      (data: any) => {
        if (data.prices) {
          this.materialPrices = data.prices;
        }
      },
      (error) => console.log(error)
    );
  }

  onFileInput(ev: any) {
    let file = ev.target.files[0];
    this.newMatImage = file;
  }

  processFormData() {
    const formData = new FormData();
    formData.append(`id`, this.matForm.id);
    formData.append(`name`, this.matForm.name);
    formData.append(`price`, this.matForm.price);
    let isFile = this.newMatImage.type.split("/")[0];
    if (isFile == "image") {
      formData.append(
        `image`,
        this.newMatImage,
        "material-" + this.newMatImage.name
      );
    }

    return formData;
  }

  addNewMaterial(form) {
    this.loading = true;
    var newForm = this.processFormData();
    this.Auth.setMaterialPrices(this.token.phone, newForm).subscribe(
      (data) => this.handleSuccess(data),
      (error) =>
        this.handleError({
          error:
            "An error occured while trying to edit the material prices. There is possibly a duplicate.",
        })
    );
  }

  handleSuccess(data) {
    this.modalTitle = "Success";
    this.modalBody = data.message;
    this.cancelMaterialEdit();
    this.loading = false;
    this.getPrices();
    this.openModal(this.content);
  }

  handleError(error) {
    this.modalTitle = "Error";
    this.modalBody = error.error;
    this.loading = false;
    this.openModal(this.content);
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }

  resetForm() {
    this.matForm.id = "";
    this.matForm.name = "";
    this.matForm.price = "";
    this.newMatImage = { name: "", type: "test" };
  }

  enablePriceEdit(i) {
    this.edit = true;
    this.matForm.id = this.materialPrices[i].id;
    this.matForm.name = this.materialPrices[i].name;
    this.matForm.price = this.materialPrices[i].price;
    this.newMatImage.name = this.materialPrices[i].image;
  }

  editMaterial() {
    this.loading = true;
    var editForm = this.processFormData();
    this.Auth.editMaterialPrices(this.token.phone, editForm).subscribe(
      (data) => this.handleSuccess(data),
      (error) => this.handleError(error)
    );
  }

  cancelMaterialEdit() {
    this.edit = false;
    this.resetForm();
  }

  formValid() {
    if (this.matForm.id == "" || this.matForm.name == "") {
      return false;
    }
    return true;
  }
}
