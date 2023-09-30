import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  user: any;
  conv: any;
  constructor() {}
  getUser() {
    JSON.parse(localStorage.getItem('user') || '{}');
  }
  getConv() {
    JSON.parse(localStorage.getItem('conv') || '{}');
  }
  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  setConv(conv: any) {
    localStorage.setItem('conv', JSON.stringify(conv));
  }
  logout() {
    localStorage.clear();
  }
}
