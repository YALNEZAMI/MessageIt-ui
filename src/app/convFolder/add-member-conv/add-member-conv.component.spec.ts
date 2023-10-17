import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMemberConvComponent } from './add-member-conv.component';

describe('AddMemberConvComponent', () => {
  let component: AddMemberConvComponent;
  let fixture: ComponentFixture<AddMemberConvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMemberConvComponent]
    });
    fixture = TestBed.createComponent(AddMemberConvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
