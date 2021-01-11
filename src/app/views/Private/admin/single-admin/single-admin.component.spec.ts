import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleAdminComponent } from './single-admin.component';

describe('SingleAdminComponent', () => {
  let component: SingleAdminComponent;
  let fixture: ComponentFixture<SingleAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
