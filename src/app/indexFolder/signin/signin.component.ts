import { Component } from '@angular/core';
import { first } from 'rxjs';
import { UserService } from '../../Services/user.service';
import { SessionService } from 'src/app/Services/session.service';
import { Router } from '@angular/router';
import { env } from 'src/env';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  user = {
    firstName: '',
    lastName: '',
    email: '',
    photo: '',
    password: '',
    password2: '',
  };
  response: any = {
    status: 0,
    message: '',
  };
  alert: boolean = false;
  passwordDontMatch: boolean = false;
  success: boolean = false;
  alertMessage: string = '';
  spinner: boolean = false;
  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private router: Router
  ) {}
  async addUser() {
    this.spinner = true;
    if (
      this.user.firstName != '' &&
      this.user.lastName != '' &&
      this.user.email != '' &&
      this.user.password != '' &&
      this.user.password2 != ''
    ) {
      if (this.user.password == this.user.password2) {
        this.userService.addUser(this.user).subscribe(async (res: any) => {
          this.response = res;
          this.success = (await res.status) == 200;
          if (this.success) {
            let user = await this.response.user;
            this.sessionService.setUser(user);
            this.router.navigate(['admin/convs']);
            // this.user = {
            //   photo: '',
            //   firstName: '',
            //   lastName: '',
            //   email: '',
            //   password: '',
            //   password2: '',
            // };
          }
          this.lanceAlert(this.response.message);
        });
      } else {
        this.passwordDontMatch = true;
        this.success = false;
        this.lanceAlert('Passwords do not match !');
      }
    } else {
      this.success = false;
      this.lanceAlert('Please fill all the fields !');
    }
    this.spinner = false;
  }
  lanceAlert(msg: string) {
    this.getAlertClasses();
    this.alertMessage = msg;
    setTimeout(() => {
      this.alert = true;
    }, 100);
    setTimeout(() => {
      this.alert = false;
    }, 3000);
  }

  getAlertClasses() {
    return {
      'alert-danger': !this.success,
      'alert-success': this.success,
      alert: this.alert,
    };
  }
  getPasswordClasses() {
    return {
      'alert-danger': this.response.status == 500 || this.passwordDontMatch,
      alert: this.passwordDontMatch,
    };
  }
  checkPassword() {
    if (this.user.password == this.user.password2) {
      this.passwordDontMatch = false;
    } else {
      this.passwordDontMatch = true;
    }
  }
}
