import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultConvsComponent } from './result-convs.component';

describe('ResultConvsComponent', () => {
  let component: ResultConvsComponent;
  let fixture: ComponentFixture<ResultConvsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultConvsComponent]
    });
    fixture = TestBed.createComponent(ResultConvsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
