import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producers',
  templateUrl: './producers.component.html',
  styleUrls: ['./producers.component.css']
})
export class ProducersComponent implements OnInit {
  segment = "header";

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if(this.activatedRoute.snapshot.paramMap.get('segment')){
      this.segment = this.activatedRoute.snapshot.paramMap.get('segment');
      var el = document.getElementById(this.segment)
      this.scroll(el);
    }
  }

  scroll(el: HTMLElement){
    el.scrollIntoView();
  }
}
