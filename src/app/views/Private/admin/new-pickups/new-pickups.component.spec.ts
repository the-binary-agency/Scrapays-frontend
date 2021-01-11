import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPickupsComponent } from './new-pickups.component';

describe('NewPickupsComponent', () => {
  let component: NewPickupsComponent;
  let fixture: ComponentFixture<NewPickupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPickupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPickupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
