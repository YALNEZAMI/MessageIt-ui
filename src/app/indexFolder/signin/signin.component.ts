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
    if (!this.user.email.includes('@')) {
      //email check
      this.lanceAlert('Please,use you real email !');
      return;
    }
    if (
      //miss fileds
      this.user.firstName == '' &&
      this.user.lastName == '' &&
      this.user.email == '' &&
      this.user.password == '' &&
      this.user.password2 == ''
    ) {
      this.lanceAlert('Please fill all the fields !');
      return;
    } else if (this.user.password.length < 6) {
      //short password
      this.lanceAlert('Password so short (minimum 6 digits) !');
      return;
    } else if (this.user.password != this.user.password2) {
      //passwords dont match
      this.lanceAlert('Passwords do not match !');
      return;
    } else if (!this.user.email.includes('@')) {
      //email check
      this.lanceAlert('Please,use you real email !');
      return;
    } else {
      this.spinner = true; //activing spinner during the operation
      //registering
      this.userService.addUser(this.user).subscribe(async (res: any) => {
        this.response = res;
        this.success = (await res.status) == 200;
        if (this.success) {
          // if adding success, go to admin with user as token
          let user = await this.response.user;
          this.sessionService.setThisUser(user);

          this.router.navigate(['admin/convs']);
        } else {
          // if adding failed, display the server message
          this.lanceAlert(this.response.message);
          this.spinner = false;
        }
      });
    }
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
