import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MaterialImagesHandlerService {

  constructor () { }

  files: any[] = [
    {
      'item': 1,
       'images': []
    }
  ];
  materialImages: any[] = [
     {
      'item': 1,
       'images': []
    }
  ];
  itemCount: number = 1;
  
  processFiles( files, ind ) {
  for (let file of files) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = ( e: any ) => {
          this.materialImages[ind].images.push( file )
          console.log('material images are ', this.materialImages);
          this.files[ind].images.push( { name: file.name, size: file.size, url: e.target.result } )
          console.log('files are ', this.files);
    }
  }
}

formatBytes(bytes){
  var raw = bytes / (1024 * 1024);
  return raw.toFixed(2) + " MB";
  } 

  rearrangeFiles() {
    for ( let image of this.materialImages ) {
      image.item = (this.materialImages.indexOf( image ) + 1);
      }
    for ( let file of this.files ) {
      file.item = ( this.files.indexOf( file ) + 1 );
      }
}

deleteItemFiles(i){
  this.files.splice( i, 1 );
  this.materialImages.splice( i, 1 );
}
  
  deleteFile( i, ind ) {
      this.materialImages[i].images.splice( ind, 1 );
      this.files[i].images.splice( ind, 1 );
}
  removeAll( i ) {
    this.files[ i ].images.splice( 0 );
    this.materialImages[ i ].images.splice( 0 );
  }
  resetTemps() {
   this.files = [
    {
      'item': 1,
       'images': []
    }
  ];
  this.materialImages= [
     {
      'item': 1,
       'images': []
    }
  ];
}

}
