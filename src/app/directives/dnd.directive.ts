import { Directive, HostListener, HostBinding, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {

@HostBinding('class.fileover') fileOver : boolean;
@Output() fileDropped = new EventEmitter<any>();

  constructor() { }

  //Dragover Listener 
  @HostListener('dragover', ['$event']) onDragOver (evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  //DragLeave Listener
  @HostListener('dragleave', ['$event']) public onDragLeave (evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  //Drop Listener
  @HostListener('drop', ['$event']) public ondrop (evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    const files = evt.dataTransfer.files;
    if (files.length > 0){
      this.fileDropped.emit(files);
    }
  }

}
