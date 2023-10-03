import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConvService } from 'src/app/Services/conv.service';
import { FriendService } from 'src/app/Services/friend.service';
import { UserService } from 'src/app/Services/user.service';
import { env } from 'src/env';

@Component({
  selector: 'app-conv-settings',
  templateUrl: './conv-settings.component.html',
  styleUrls: ['./conv-settings.component.css'],
})
export class ConvSettingsComponent {
  conv = JSON.parse(localStorage.getItem('conv') || '{}');
  convInfos: any = {
    photo: this.conv.photo,
    name: this.conv.name,
    description: this.conv.description,
  };
  file: any;
  constructor(
    private router: Router,
    private friendService: FriendService,
    private convService: ConvService,
    private userService: UserService
  ) {}

  leaveConv() {
    let blockBtn = document.getElementById('blockBtn');

    if (blockBtn != null) {
      blockBtn.setAttribute('disabled', 'true');
      blockBtn.innerHTML = 'leaving...';
    }
    this.convService.leaveConv().subscribe((res) => {
      localStorage.removeItem('conv');
      this.router.navigate(['/admin/convs']);
    });
  }
  update() {
    let fileInput = document.getElementById(
      'convPhotoInput'
    ) as HTMLInputElement;
    if (fileInput.files?.item(0) != null) {
      this.file = fileInput.files?.item(0);
      this.convService.updatePhoto(this.file).subscribe((res: any) => {
        let photo = res.photo;
        this.convInfos.photo = photo;
        let conv = JSON.parse(localStorage.getItem('conv') || '{}');
        conv.photo = photo;
        localStorage.setItem('conv', JSON.stringify(conv));
        this.convService.setConvChanged(conv);
      });
    }

    let conv = {
      name: this.convInfos.name,
      description: this.convInfos.description,
    };
    this.convService.update(conv).subscribe(async (res: any) => {
      console.log(res);
      this.convInfos = res;
      this.convInfos.photo = res.photo;
      localStorage.setItem('conv', JSON.stringify(res));
    });
    fileInput.files = null;
  }
  clickPhoto() {
    document.getElementById('convPhotoInput')?.click();
  }
  displayPhoto() {
    let cadrePhoto = document.getElementById('cadrePhoto') as HTMLImageElement;
    if (cadrePhoto.style.display == 'block') {
      cadrePhoto.style.display = 'none';
    } else {
      cadrePhoto.style.display = 'block';
    }
  }
}
