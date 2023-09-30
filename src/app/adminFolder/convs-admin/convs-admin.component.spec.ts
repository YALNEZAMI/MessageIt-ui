import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvsAdminComponent } from './convs-admin.component';

describe('ConvsAdminComponent', () => {
  let component: ConvsAdminComponent;
  let fixture: ComponentFixture<ConvsAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConvsAdminComponent]
    });
    fixture = TestBed.createComponent(ConvsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
