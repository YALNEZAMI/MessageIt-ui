import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderConvComponent } from './header-conv.component';

describe('HeaderConvComponent', () => {
  let component: HeaderConvComponent;
  let fixture: ComponentFixture<HeaderConvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderConvComponent]
    });
    fixture = TestBed.createComponent(HeaderConvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
