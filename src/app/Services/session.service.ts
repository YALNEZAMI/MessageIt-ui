import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserService } from './user.service';
import { env } from 'src/env';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  user: any;
  conv: any;
  constructor(private router: Router, private http: HttpClient) {}
  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  getThisConv() {
    return JSON.parse(localStorage.getItem('conv') || '{}');
  }
  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    //set status online
    this.online().subscribe((data: any) => {});
  }
  setConv(conv: any) {
    localStorage.setItem('conv', JSON.stringify(conv));
  }

  async logout() {
    this.offline().subscribe((data: any) => {
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 500);

      setTimeout(() => {
        localStorage.clear();
      }, 1000);
    });
  }
  online() {
    let userReturned: any = this.http.patch(
      `${env.api_url}/session/setStatus/${this.getThisUser()._id}`,
      { status: 'online' }
    );
    return userReturned;
  }
  offline() {
    let userReturned: any = this.http.patch(
      `${env.api_url}/session/setStatus/${this.getThisUser()._id}`,
      { status: 'offline' }
    );
    return userReturned;
  }
  isAuthenticated() {
    return this.getThisUser() != null;
  }
}
