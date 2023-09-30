import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvMediasComponent } from './conv-medias.component';

describe('ConvMediasComponent', () => {
  let component: ConvMediasComponent;
  let fixture: ComponentFixture<ConvMediasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConvMediasComponent]
    });
    fixture = TestBed.createComponent(ConvMediasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
