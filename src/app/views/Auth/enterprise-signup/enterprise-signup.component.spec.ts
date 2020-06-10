import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseSignupComponent } from './enterprise-signup.component';

describe('EnterpriseSignupComponent', () => {
  let component: EnterpriseSignupComponent;
  let fixture: ComponentFixture<EnterpriseSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
