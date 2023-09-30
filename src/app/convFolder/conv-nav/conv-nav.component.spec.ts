import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvNavComponent } from './conv-nav.component';

describe('ConvNavComponent', () => {
  let component: ConvNavComponent;
  let fixture: ComponentFixture<ConvNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConvNavComponent]
    });
    fixture = TestBed.createComponent(ConvNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
