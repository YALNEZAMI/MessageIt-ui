import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  response = {
    status: 0,
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
    if (this.data.password != this.data.password2 || this.data.password == '') {
      setTimeout(() => {
        this.password.nativeElement.style.border = '1px solid red';
        this.password2.nativeElement.style.border = '1px solid red';
      }, 10);
      setTimeout(() => {
        this.password.nativeElement.style.border = '0px solid red';
        this.password2.nativeElement.style.border = '0px solid red';
      }, 3000);
      return;
    }

    if (this.data.codePassword.toString().length != 6) {
      setTimeout(() => {
        this.code.nativeElement.style.border = '1px solid red';
      }, 10);
      setTimeout(() => {
        this.code.nativeElement.style.border = '0px solid red';
      }, 3000);
      return;
    }
    this.userService.resetPassword(this.data).subscribe((res: any) => {
      if (res.status == 404) {
        this.response = res;
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
