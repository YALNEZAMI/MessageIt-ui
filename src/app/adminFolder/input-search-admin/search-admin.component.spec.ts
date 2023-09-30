import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAdminComponent } from './search-admin.component';

describe('SearchAdminComponent', () => {
  let component: SearchAdminComponent;
  let fixture: ComponentFixture<SearchAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchAdminComponent]
    });
    fixture = TestBed.createComponent(SearchAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
