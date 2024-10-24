import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConvService } from 'src/app/Services/conv.service';
import { SessionService } from 'src/app/Services/session.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements AfterViewInit {
  password: HTMLInputElement = document.getElementById(
    'password'
  ) as HTMLInputElement;
  password2: HTMLInputElement = document.getElementById(
    'password2'
  ) as HTMLInputElement;
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
  isPhotoBigFormat = false;
  photoUrl: string | ArrayBuffer | null = null;
  constructor(
    private router: Router,
    private userService: UserService,
    private sessionService: SessionService,
    private convService: ConvService
  ) {
    this.user = this.userService.getThisUser();
    this.photoUrl = this.user.photo;
    if (this.user.theme != undefined && this.user.theme != '') {
      this.selectedTheme = this.user.theme;
    } else {
      this.selectedTheme = 'basic';
    }
  }
  getDifferentStatus() {
    if (this.user.status == 'online') {
      return 'offline';
    } else {
      return 'online';
    }
  }
  ngAfterViewInit(): void {
    this.password = document.getElementById('password') as HTMLInputElement;
    this.password2 = document.getElementById('password2') as HTMLInputElement;
  }

  async logout() {
    this.logedout = true;
    this.sessionService.logout();
  }
  getPhoto() {
    return JSON.parse(localStorage.getItem('user') || '{}').photo;
  }
  displayPhoto() {
    this.isPhotoBigFormat = !this.isPhotoBigFormat;
  }
  updateUser() {
    //check email
    if (this.user.email && !this.user.email.includes('@')) {
      this.lanceAlert({ status: 404, message: 'Please,use your real email !' });
      return;
    }
    this.photoSelectedName = '';
    //get input file
    let inputImg = document.getElementById('convImgInput') as HTMLInputElement;
    //check if password match
    if (this.user.password != this.user.password2 && this.user.password != '') {
      setTimeout(() => {
        this.password.style.border = '1px solid red';
        this.password2.style.border = '1px solid red';
        this.lanceAlert({ status: 404, message: 'Passwords dont match !' });
      }, 10);
      setTimeout(() => {
        this.password.style.border = '0px ';
        this.password2.style.border = '0px ';
        this.lanceAlert({ status: 0, message: '' });
      }, 3000);
      return;
    }
    //delete password if empty
    if (this.user.password == '') {
      delete this.user.password;
      delete this.user.password2;
    }

    //set theme
    this.user.theme = this.selectedTheme;
    this.userService.updateInfos(this.user).subscribe((userUpdated: any) => {
      localStorage.setItem('user', JSON.stringify(userUpdated));
      this.userService.setTheme();
      this.user = userUpdated;
      this.userService.setNameChanged(
        userUpdated.firstName + ' ' + userUpdated.lastName
      );

      if (inputImg.files?.length != 0) {
        this.userService
          .uploadConvImg(inputImg.files?.item(0), userUpdated._id)
          .subscribe((userUpdated: any) => {
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
    this.convService.leaveAllConvs().subscribe((res) => {
      this.userService.delete(this.user).subscribe((res) => {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
      });
    });
  }
  clickPhoto() {
    let input = document.getElementById('convImgInput') as HTMLInputElement;
    input.click();
  }
  selected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    this.photoSelectedName = fileInput.files![0].name;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      // Charger l'image et définir la preview
      reader.onload = (e) => {
        this.photoUrl = reader.result; // Met à jour la preview URL avec le résultat de la lecture du fichier
      };

      reader.readAsDataURL(file); // Lire le fichier comme une URL de données
    }
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
      'text-dark': theme != 'panda',
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
    this.photoUrl = this.user.photo;
  }
}
