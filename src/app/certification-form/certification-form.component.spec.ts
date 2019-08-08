import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationFormComponent } from './certification-form.component';

describe('CertificationFormComponent', () => {
  let component: CertificationFormComponent;
  let fixture: ComponentFixture<CertificationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
