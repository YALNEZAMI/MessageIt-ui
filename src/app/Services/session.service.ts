import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  user: any;
  conv: any;
  constructor(private userService: UserService) {}
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
  async logout() {
    localStorage.clear();
  }
}
