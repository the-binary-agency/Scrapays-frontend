import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MaterialImagesHandlerService {
  constructor() {}

  files: any[] = [
    {
      item: 1,
      images: [],
    },
  ];
  material_images: any[] = [
    {
      item: 1,
      images: [],
    },
  ];
  itemCount: number = 1;

  processFiles(files, ind) {
    for (let file of files) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        this.material_images[ind].images.push(file);
        this.files[ind].images.push({
          name: file.name,
          size: file.size,
          url: e.target.result,
        });
      };
    }
  }

  formatBytes(bytes) {
    var raw = bytes / (1024 * 1024);
    return raw.toFixed(2) + ' MB';
  }

  rearrangeFiles() {
    for (let image of this.material_images) {
      image.item = this.material_images.indexOf(image) + 1;
    }
    for (let file of this.files) {
      file.item = this.files.indexOf(file) + 1;
    }
  }

  deleteItemFiles(i) {
    this.files.splice(i, 1);
    this.material_images.splice(i, 1);
  }

  deleteFile(i, ind) {
    this.material_images[i].images.splice(ind, 1);
    this.files[i].images.splice(ind, 1);
  }
  removeAll(i) {
    this.files[i].images.splice(0);
    this.material_images[i].images.splice(0);
  }
  resetTemps() {
    this.files = [
      {
        item: 1,
        images: [],
      },
    ];
    this.material_images = [
      {
        item: 1,
        images: [],
      },
    ];
  }
}
