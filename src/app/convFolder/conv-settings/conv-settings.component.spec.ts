import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvSettingsComponent } from './conv-settings.component';

describe('ConvSettingsComponent', () => {
  let component: ConvSettingsComponent;
  let fixture: ComponentFixture<ConvSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConvSettingsComponent]
    });
    fixture = TestBed.createComponent(ConvSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
