import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectMaterialsComponent } from './collect-materials.component';

describe('CollectMaterialsComponent', () => {
  let component: CollectMaterialsComponent;
  let fixture: ComponentFixture<CollectMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
