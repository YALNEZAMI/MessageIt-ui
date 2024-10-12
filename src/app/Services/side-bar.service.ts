import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  SideBarVisible: any = new Subject<any>();
  getSideBarVisible() {
    return this.SideBarVisible.asObservable();
  }
  setSideBarVisible(val: boolean) {
    this.SideBarVisible.next(val);
  }
  constructor() {}
}
