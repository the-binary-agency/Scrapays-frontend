import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackCollectorComponent } from './track-collector.component';

describe('TrackCollectorComponent', () => {
  let component: TrackCollectorComponent;
  let fixture: ComponentFixture<TrackCollectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackCollectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackCollectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
