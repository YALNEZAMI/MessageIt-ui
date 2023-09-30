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
  deleteCheck: boolean = false;
  photoSelectedName = '';
  user: any;
  logedout = false;
  alert: boolean = false;
  noRes = false;
  done = true;
  constructor(
    private router: Router,
    private userService: UserService,
    private sessionService: SessionService
  ) {
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
    this.router.navigate(['/auth/login']);
  }
  getPhoto() {
    return JSON.parse(localStorage.getItem('user') || '{}').photo;
  }
  updateUser() {
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
    }

    let userUpdated: any;
    this.userService.updateInfos(this.user).subscribe(async (res: any) => {
      userUpdated = await res;
      localStorage.setItem('user', JSON.stringify(userUpdated));
      this.user = userUpdated;
      this.userService.setNameChanged(
        userUpdated.firstName + ' ' + userUpdated.lastName
      );

      if (inputImg.files?.item(0) != null) {
        this.userService
          .uploadConvImg(inputImg.files?.item(0), userUpdated._id)
          .subscribe(async (res: any) => {
            // console.log(this.getPhoto(await res.photo));
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
}
