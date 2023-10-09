import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  loading = false;
  response = {
    status: 200,
    message: '',
  };
  data: any = {
    email: localStorage.getItem('email'),
    password: '',
    password2: '',
    codePassword: '',
  };
  @ViewChild('code') code: ElementRef = new ElementRef('');
  @ViewChild('password') password: ElementRef = new ElementRef('');
  @ViewChild('password2') password2: ElementRef = new ElementRef('');

  constructor(private router: Router, private userService: UserService) {}
  resetPassword() {
    if (this.data.password == '' || this.data.codePassword == '') {
      this.lanceAlert('Please, fill all fields !');
      return;
    } else if (this.data.password.length < 6) {
      this.lanceAlert('Short password !');
      return;
    }
    if (this.data.password != this.data.password2) {
      this.lanceAlert('Passwords dont match !');
      return;
    }
    if (this.data.codePassword.toString().length != 6) {
      this.lanceAlert('Password code must have 6 digits !');
      return;
    }
    this.loading = true;
    this.userService.resetPassword(this.data).subscribe(async (res: any) => {
      if (res.status != 200) {
        this.loading = false;
        this.lanceAlert(await res.message);
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }
  lanceAlert(msg: string) {
    this.response = {
      status: 404,
      message: msg,
    };
    setTimeout(() => {
      this.response = {
        status: 200,
        message: '',
      };
    }, 3000);
  }
}
