import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Interfaces/User.interface';
import { SessionService } from 'src/app/Services/session.service';
import { UserService } from 'src/app/Services/user.service';
import { env } from 'src/env';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  @ViewChild('deleteBtn') deleteBtn: ElementRef = new ElementRef('');
  @ViewChild('password') password: ElementRef = new ElementRef('');
  @ViewChild('password2') password2: ElementRef = new ElementRef('');
  themes: string[] = ['basic', 'love', 'spring', 'panda'];
  selectedTheme: string;
  deleteCheck: boolean = false;
  photoSelectedName = '';
  user: any;
  logedout = false;
  alert: boolean = false;
  noRes = false;
  done = true;
  response: any = {
    status: 200,
    message: 'password is so short',
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private sessionService: SessionService
  ) {
    if (JSON.parse(localStorage.getItem('user') || '{}').theme != undefined) {
      this.selectedTheme = JSON.parse(
        localStorage.getItem('user') || '{}'
      ).theme;
    } else {
      this.selectedTheme = 'basic';
    }
    this.selectedTheme =
      JSON.parse(localStorage.getItem('user') || '{}').theme || 'basic';
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }
  getDifferentStatus() {
    if (this.user.status == 'online') {
      return 'offline';
    } else {
      return 'online';
    }
  }

  async logout() {
    this.logedout = true;
    this.sessionService.logout();
  }
  getPhoto() {
    return JSON.parse(localStorage.getItem('user') || '{}').photo;
  }
  displayPhoto() {
    let cadrePhoto = document.getElementById('cadrePhoto') as HTMLImageElement;
    if (cadrePhoto.style.display == 'block') {
      cadrePhoto.style.display = 'none';
    } else {
      cadrePhoto.style.display = 'block';
    }
  }
  updateUser() {
    //check email
    if (!this.user.email.includes('@')) {
      this.lanceAlert({ status: 404, message: 'Please,use your real email !' });
      return;
    }
    this.photoSelectedName = '';
    //get input file
    let inputImg = document.getElementById('convImgInput') as HTMLInputElement;
    //check if password match
    if (this.user.password != this.user.password2 && this.user.password != '') {
      setTimeout(() => {
        this.password.nativeElement.style.border = '1px solid red';
        this.password2.nativeElement.style.border = '1px solid red';
      }, 10);
      setTimeout(() => {
        this.password.nativeElement.style.border = '0px ';
        this.password2.nativeElement.style.border = '0px ';
      }, 3000);
      return;
    }
    //delete password if empty
    if (this.user.password == '') {
      delete this.user.password;
      delete this.user.password2;
    }

    let userUpdated: any;
    //set them
    this.user.theme = this.selectedTheme;

    this.userService.updateInfos(this.user).subscribe(async (res: any) => {
      userUpdated = await res;
      localStorage.setItem('user', JSON.stringify(userUpdated));
      this.userService.setTheme();
      this.user = userUpdated;
      this.userService.setNameChanged(
        userUpdated.firstName + ' ' + userUpdated.lastName
      );

      if (inputImg.files?.length != 0) {
        this.userService
          .uploadConvImg(inputImg.files?.item(0), userUpdated._id)
          .subscribe(async (res: any) => {
            userUpdated.photo = await res.photo;
            localStorage.setItem('user', JSON.stringify(userUpdated));
            this.user = userUpdated;
          });
      }
      setTimeout(() => {
        this.alert = true;
      }, 10);
      setTimeout(() => {
        this.alert = false;
      }, 2000);
    });
    inputImg.files = null;
    this.lanceAlert({
      status: 200,
      message: 'Your profile has been updated Successfully !',
    });
  }
  delete() {
    this.userService.delete(this.user).subscribe((res) => {
      localStorage.removeItem('user');
      localStorage.removeItem('conv');
      this.router.navigate(['/auth']);
    });
  }
  clickPhoto() {
    let input = document.getElementById('convImgInput') as HTMLInputElement;
    input.click();
  }
  selected() {
    let input = document.getElementById('convImgInput') as HTMLInputElement;
    this.photoSelectedName = input.files?.item(0)?.name || '';
    // this.photoSelectedName = this.photo.files?.item(0)?.name || '';
  }
  lanceAlert(response: any) {
    this.alert = true;
    this.response.status = response.status;
    this.response.message = response.message;
    setTimeout(() => {
      this.alert = false;
      this.response.status = 200;
      this.response.message = '';
    }, 3000);
  }
  getAlertClasses() {
    return {
      'text-center': true,
      alert: true,
      'alert-success': this.response.status == 200,
      'alert-danger': this.response.status != 200,
    };
  }
  getSelectThemeClasses() {
    return {
      selectpicker: true,

      'bg-light': this.selectedTheme == 'basic',
      'bg-danger': this.selectedTheme == 'love',
      'bg-success': this.selectedTheme == 'spring',
      'bg-dark': this.selectedTheme == 'panda',
      'text-light': this.selectedTheme == 'panda',
    };
  }
  getThemeClass(theme: string) {
    return {
      'bg-light': theme == 'basic',
      'bg-danger': theme == 'love',
      'bg-success': theme == 'spring',
      'bg-dark': theme == 'panda',
      'text-light': theme == 'panda',
    };
  }
  unselectProfilePhoto() {
    let profilePhotoForm = document.getElementById(
      'profilePhotoForm'
    ) as HTMLFormElement;
    profilePhotoForm.reset();
    this.photoSelectedName = '';
  }
}
