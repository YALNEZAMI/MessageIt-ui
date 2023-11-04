import { Component } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/Services/session.service';
import { ConvService } from 'src/app/Services/conv.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  hasTokenBool: any = this.sessionService.thereIsToken();

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
    private sessionService: SessionService,
    private convService: ConvService
  ) {}
  hasToken() {
    return this.hasTokenBool;
  }
  login() {
    this.loginBtn = false;
    if (this.data.email != '' && this.data.password != '') {
      this.userService.login(this.data).subscribe(async (res: any) => {
        if (res.status == 500) {
          this.loginBtn = true;

          this.lanceAlert(res.message);
        } else if (res.status == 501) {
          this.loginBtn = true;

          this.lanceAlert(res.message);
        } else {
          this.sessionService.setToken(res.user._id);
          this.sessionService.setThisUser(res.user);
          this.convService.getConvs().subscribe(async (convs: any) => {
            //set convs in local storage
            this.sessionService.setThisConvs(convs);
            this.loginBtn = true;
            this.router.navigate(['admin/convs']);
          });
        }
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
