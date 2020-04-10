import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleListedScrapComponent } from './single-listed-scrap.component';

describe('SingleListedScrapComponent', () => {
  let component: SingleListedScrapComponent;
  let fixture: ComponentFixture<SingleListedScrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleListedScrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleListedScrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
