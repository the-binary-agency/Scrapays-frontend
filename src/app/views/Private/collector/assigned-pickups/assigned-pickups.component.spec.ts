import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedPickupsComponent } from './assigned-pickups.component';

describe('AssignedPickupsComponent', () => {
  let component: AssignedPickupsComponent;
  let fixture: ComponentFixture<AssignedPickupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedPickupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedPickupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
