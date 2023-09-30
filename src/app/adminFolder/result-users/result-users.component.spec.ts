import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultUsersComponent } from './result-users.component';

describe('ResultUsersComponent', () => {
  let component: ResultUsersComponent;
  let fixture: ComponentFixture<ResultUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultUsersComponent]
    });
    fixture = TestBed.createComponent(ResultUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
