import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenService } from 'src/app/services/auth/token.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EnvironmentService } from 'src/app/services/env/environment.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-materials',
  templateUrl: './edit-materials.component.html',
  styleUrls: ['./edit-materials.component.css'],
})
export class EditMaterialsComponent implements OnInit {
  @ViewChild('content') private content;

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
    id: 'test',
    name: '',
    price: 0,
    collector_commission: 0,
    host_commission: 0,
  };
  newMatImage: any = { name: '', type: 'test' };
  materialLoading = false;
  loading = false;
  edit = false;
  currentPage = 1;
  collectionSize = 1;
  pageSize = 1;

  ngOnInit(): void {
    this.getPrices();
  }

  getPrices(query?) {
    this.materialLoading = true;
    this.Auth.getMaterialPrices(query).subscribe(
      (res: any) => {
        this.currentPage = res.current_page;
        this.collectionSize = res.total;
        this.pageSize = res.per_page;
        this.materialPrices = res.data;
        this.materialLoading = false;
      },
      (error) => {
        this.materialLoading = false;
        console.log(error);
      }
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
    formData.append(`price`, this.matForm.price.toString());
    formData.append(
      `collector_commission`,
      this.matForm.collector_commission.toString()
    );
    formData.append(`host_commission`, this.matForm.host_commission.toString());
    let isFile = this.newMatImage.type.split('/')[0];
    if (isFile == 'image') {
      formData.append(
        `image`,
        this.newMatImage,
        'material-' + this.newMatImage.name
      );
    }

    return formData;
  }

  addNewMaterial(form) {
    this.loading = true;
    var newForm = this.processFormData();
    this.Auth.setMaterialPrices(newForm).subscribe(
      (res: any) => this.handleSuccess(res.data),
      (error) => this.handleError(error)
    );
  }

  handleSuccess(data) {
    this.modalTitle = 'Success';
    this.modalBody = data;
    this.cancelMaterialEdit();
    this.loading = false;
    this.getPrices();
    this.openModal(this.content);
  }

  handleError(error) {
    this.modalTitle = 'Error';
    this.modalBody = error.error.error;
    this.loading = false;
    this.openModal(this.content);
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }

  resetForm() {
    this.matForm.id = 'test';
    this.matForm.name = '';
    this.matForm.price = 0;
    this.matForm.collector_commission = 0;
    this.matForm.host_commission = 0;
    this.newMatImage = { name: '', type: 'test' };
  }

  enablePriceEdit(i) {
    this.edit = true;
    this.matForm.id = this.materialPrices[i].id;
    this.matForm.name = this.materialPrices[i].name;
    this.matForm.price = this.materialPrices[i].price;
    this.matForm.collector_commission = this.materialPrices[
      i
    ].collector_commission;
    this.matForm.host_commission = this.materialPrices[i].host_commission;
    this.newMatImage.name = this.materialPrices[i].image;
  }

  editMaterial() {
    this.loading = true;
    var editForm = this.processFormData();
    this.Auth.editMaterialPrices(this.matForm.id, editForm).subscribe(
      (res: any) => this.handleSuccess(res.data),
      (error) => this.handleError(error)
    );
  }

  deleteMaterial() {
    this.loading = true;
    this.Auth.deleteMaterialPrices(this.matForm.id).subscribe(
      (res: any) => this.handleSuccess(res.data),
      (error) => this.handleError(error)
    );
  }

  cancelMaterialEdit() {
    this.edit = false;
    this.resetForm();
  }

  formValid() {
    if (this.edit == true) {
      if (
        this.matForm.id == '' ||
        this.matForm.name == '' ||
        this.matForm.price < 1 ||
        this.matForm.collector_commission < 1 ||
        this.matForm.host_commission < 1 ||
        this.newMatImage.name == ''
      ) {
        return false;
      }
      return true;
    } else {
      if (
        this.matForm.name == '' ||
        this.matForm.price < 1 ||
        this.matForm.collector_commission < 1 ||
        this.matForm.host_commission < 1 ||
        this.newMatImage.name == ''
      ) {
        return false;
      }
      return true;
    }
  }

  changePage() {
    let query = `&page=${this.currentPage}`;
    this.getPrices(query);
  }
}
