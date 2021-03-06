import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { ApiService } from 'src/app/services/auth/api.service';
import { Listed_Scrap } from 'src/app/models/listed_scrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialImagesHandlerService } from 'src/app/services/general/material-images-handler.service';

declare var $: any;

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
})
export class ListingComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('content') private content;

  public loading = false;

  Listed_Scrap: Listed_Scrap[];
  formValid: boolean = false;
  files = this.fileHandler.files;
  material_images = this.fileHandler.material_images;
  modalTitle: string;
  modalBody: string;
  public Form: FormGroup;
  itemCount = this.fileHandler.itemCount;
  validation_messages = {
    first_name: [
      { type: 'required', message: 'A First Name is required.' },
      { type: 'pattern', message: 'Please enter a valid First Name.' },
      { type: 'maxlength', message: 'Please enter a shorter First Name.' },
    ],
    last_name: [
      { type: 'required', message: 'A Last Name is required.' },
      { type: 'pattern', message: 'Please enter a valid Last Name.' },
      { type: 'maxlength', message: 'Please enter a shorter Last Name.' },
    ],
    phone: [
      { type: 'required', message: 'A Phone Number is required.' },
      { type: 'pattern', message: 'Please enter a valid Phone Number.' },
      { type: 'minlength', message: 'Please enter a valid Phone Number.' },
      { type: 'maxlength', message: 'Please enter a valid Phone Number.' },
    ],
    email: [
      { type: 'required', message: 'An Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' },
    ],
    material_location: [
      { type: 'required', message: 'Material Location is required.' },
    ],
    description: [
      { type: 'required', message: 'Material Description is required.' },
    ],
    material_images: [
      { type: 'required', message: 'Material Images are required.' },
      { type: 'minLength', message: 'minimum length is {{0}}.' },
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private modal: NgbModal,
    private fileHandler: MaterialImagesHandlerService
  ) {}

  initForm() {
    this.Form = this.formBuilder.group({
      company_name: new FormControl(''),
      first_name: new FormControl(
        '',
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ])
      ),
      last_name: new FormControl(
        '',
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z ]*'),
          Validators.required,
        ])
      ),
      phone: new FormControl(
        '',
        Validators.compose([
          Validators.pattern('[0-9 ]*'),
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.required,
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      material_location: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      materialDescription: this.formBuilder.array([
        this.formBuilder.group({
          description: new FormControl(
            '',
            Validators.compose([Validators.required])
          ),
        }),
      ]),
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  addItem() {
    this.itemCount++;
    this.FormAsArray.push(
      this.formBuilder.group({
        description: new FormControl(
          '',
          Validators.compose([Validators.required])
        ),
      })
    );
    // this.ItemForm.addControl('materialDescription ' + this.itemCount, new FormControl('', Validators.compose([
    //     Validators.required,
    // ] ) ) );
    const material_images = {
      item: this.itemCount,
      images: [],
    };
    const files = {
      item: this.itemCount,
      images: [],
    };
    this.material_images.push(material_images);
    this.files.push(files);
  }

  removeItem(control, i) {
    this.itemCount--;
    this.FormAsArray.removeAt(i);
    this.deleteItemFiles(i);
    this.fileHandler.rearrangeFiles();
  }

  list(Form) {
    this.loading = true;
    const formData = this.processForm();
    this.apiService.listScrap(formData).subscribe(
      (data) => {
        this.loading = false;
        this.handleSuccess();
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  validateImages(i) {
    var images = this.material_images;
    for (let image of images[i].images) {
      if (image.size / 1024 > 2048) {
        return false;
      }
    }

    if (!images[i].images.length || images[i].images.length > 3) {
      return false;
    } else {
      return true;
    }
  }

  imagesSubmitted() {
    for (let item of this.material_images) {
      for (let image of item.images) {
        if (image.size / 1024 > 2048) {
          return false;
        }
      }

      if (
        !item.images.length ||
        item.images.length > 3 ||
        item.images.length == 0
      ) {
        return false;
      }
    }
  }

  processForm() {
    const images = this.material_images;
    const controls = this.FormAsArray.controls;
    const formData = new FormData();
    formData.append('company_name', this.Form.get('company_name').value);
    formData.append('first_name', this.Form.get('first_name').value);
    formData.append('last_name', this.Form.get('last_name').value);
    formData.append('phone', this.Form.get('phone').value);
    formData.append('email', this.Form.get('email').value);
    formData.append(
      'material_location',
      this.Form.get('material_location').value
    );
    const item = [];
    for (let i = 0; i < images.length; i++) {
      for (let ind = 0; ind < images[i].images.length; ind++) {
        if (images[i].item == i + 1) {
          formData.append(
            'material_images[]',
            images[i].images[ind],
            'item ' + (i + 1) + '-' + images[i].images[ind].name
          );
        }
      }
    }

    for (let i = 0; i < controls.length; i++) {
      formData.append('materialDescription[]', controls[i].value.description);
    }
    return formData;
  }

  get FormAsArray() {
    return this.Form.get('materialDescription') as FormArray;
  }

  handleSuccess() {
    this.modalTitle = 'Success';
    this.modalBody =
      'Thank you for listing your items with Scrapays. Our Closest Agent to the item location will give you a call to schedule a physical inspection to price your items.';
    this.loading = false;
    this.openModal(this.content);
    this.resetForm();
  }

  handleError(error) {
    this.modalTitle = 'Error';
    this.modalBody = error.error.message;
    this.loading = false;
    this.openModal(this.content);
  }

  resetForm() {
    this.Form.reset();
    this.resetTemps();
  }

  resetTemps() {
    this.fileHandler.resetTemps;
  }

  onFileInput(ev: any, i: any) {
    let files = ev.target.files;
    this.fileHandler.processFiles(files, i);
  }

  onFileDropped(ev: any, i: any) {
    this.fileHandler.processFiles(ev, i);
  }

  formatBytes(bytes) {
    var raw = bytes / (1024 * 1024);
    return raw.toFixed(2) + ' MB';
  }

  deleteItemFiles(i) {
    this.fileHandler.deleteItemFiles(i);
  }

  deleteFile(i, ind) {
    this.fileHandler.deleteFile(i, ind);
  }
  removeAll(i) {
    this.fileHandler.removeAll(i);
  }

  validateFile(group: FormGroup) {
    let file = group.get('material_images').value;
  }

  gotoHowItWorks() {
    var el = document.getElementById('howitworks');
    this.scroll(el);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }
}
