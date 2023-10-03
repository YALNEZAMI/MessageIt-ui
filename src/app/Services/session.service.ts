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
    this.offline().subscribe((data: any) => {
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    });
  }
  online() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    let userReturned: any = this.http.patch(
      `${env.api_url}/user/setStatus/${user._id}`,
      { status: 'online' }
    );
    return userReturned;
  }
  offline() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    let userReturned: any = this.http.patch(
      `${env.api_url}/user/setStatus/${user._id}`,
      { status: 'offline' }
    );
    console.log(userReturned);
    return userReturned;
  }
}
