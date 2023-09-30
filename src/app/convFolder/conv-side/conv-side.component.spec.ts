import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvSideComponent } from './conv-side.component';

describe('ConvSideComponent', () => {
  let component: ConvSideComponent;
  let fixture: ComponentFixture<ConvSideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConvSideComponent]
    });
    fixture = TestBed.createComponent(ConvSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
