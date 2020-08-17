import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCollectorComponent } from './single-collector.component';

describe('SingleCollectorComponent', () => {
  let component: SingleCollectorComponent;
  let fixture: ComponentFixture<SingleCollectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleCollectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
