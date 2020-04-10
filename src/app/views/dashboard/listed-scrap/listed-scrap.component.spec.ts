import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListedScrapComponent } from './listed-scrap.component';

describe('ListedScrapComponent', () => {
  let component: ListedScrapComponent;
  let fixture: ComponentFixture<ListedScrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListedScrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListedScrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
