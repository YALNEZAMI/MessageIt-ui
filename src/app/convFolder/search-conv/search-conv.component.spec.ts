import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchConvComponent } from './search-conv.component';

describe('SearchConvComponent', () => {
  let component: SearchConvComponent;
  let fixture: ComponentFixture<SearchConvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchConvComponent]
    });
    fixture = TestBed.createComponent(SearchConvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
