import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegetPasswordComponent } from './reget-password.component';

describe('RegetPasswordComponent', () => {
  let component: RegetPasswordComponent;
  let fixture: ComponentFixture<RegetPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegetPasswordComponent]
    });
    fixture = TestBed.createComponent(RegetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
