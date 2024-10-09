import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import env from 'src/env';

@Injectable({
  providedIn: 'root',
})
export class MailerService {
  constructor(private http: HttpClient, private router: Router) {}
  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  getCode(data: any) {
    const url = env.api_url;
    return this.http.post(url + '/mailer', data);
  }
}
