import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MailerService {
  constructor(private http: HttpClient, private router: Router) {}
  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  getCode(data: any) {
    return this.http.post('http://localhost:3000/mailer', data);
  }
}
