import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/Services/session.service';
import { env } from 'src/env';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  data: any = {
    email: '',
    password: '',
  };
  alertMessage: string = '';
  alert = false;
  loginBtn = true;
  constructor(
    private userService: UserService,
    private router: Router,
    private sessionService: SessionService
  ) {}
  login() {
    this.loginBtn = false;
    if (this.data.email != '' && this.data.password != '') {
      this.userService.login(this.data).subscribe(async (res: any) => {
        if (res.status == 500) {
          this.lanceAlert(res.message);
        } else if (res.status == 501) {
          this.lanceAlert(res.message);
        } else {
          this.sessionService.setThisUser(res.user);
          this.sessionService.setThisFriends(res.user.friends);
          this.router.navigate(['admin/convs']);
        }

        this.loginBtn = true;
      });
    } else {
      this.loginBtn = true;
      this.lanceAlert('Please fill all the fields !');
    }
  }
  lanceAlert(msg: string) {
    this.alertMessage = msg;
    setTimeout(() => {
      this.alert = true;
    }, 100);
    setTimeout(() => {
      this.alert = false;
    }, 5000);
  }
  getAlertClasses() {
    return {
      'alert-danger': true,
      alert: true,
    };
  }
}
