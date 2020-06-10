import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorSignupComponent } from './collector-signup.component';

describe('CollectorSignupComponent', () => {
  let component: CollectorSignupComponent;
  let fixture: ComponentFixture<CollectorSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectorSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectorSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
