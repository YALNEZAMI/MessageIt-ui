import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MailerService {
  constructor(private http: HttpClient) {}

  getCode(data: any) {
    return this.http.post('http://localhost:3000/mailer', data);
  }
}
