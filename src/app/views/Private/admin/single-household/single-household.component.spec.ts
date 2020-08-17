import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleHouseholdComponent } from './single-household.component';

describe('SingleHouseholdComponent', () => {
  let component: SingleHouseholdComponent;
  let fixture: ComponentFixture<SingleHouseholdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleHouseholdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleHouseholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
