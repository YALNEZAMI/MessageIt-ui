import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexContentComponent } from './index-content.component';

describe('IndexContentComponent', () => {
  let component: IndexContentComponent;
  let fixture: ComponentFixture<IndexContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndexContentComponent]
    });
    fixture = TestBed.createComponent(IndexContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
