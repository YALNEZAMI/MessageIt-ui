import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifsComponent } from './notifs.component';

describe('NotifsComponent', () => {
  let component: NotifsComponent;
  let fixture: ComponentFixture<NotifsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotifsComponent]
    });
    fixture = TestBed.createComponent(NotifsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
