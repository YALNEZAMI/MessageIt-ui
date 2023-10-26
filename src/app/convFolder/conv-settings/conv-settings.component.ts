import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConvService } from 'src/app/Services/conv.service';

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
  themes = ['basic', 'love', 'spring', 'panda'];
  selectedTheme = this.themes[0];
  fileSelectedName = '';
  constructor(private router: Router, private convService: ConvService) {
    let conv = JSON.parse(localStorage.getItem('conv') || '{}');
    this.selectedTheme = conv.theme;
  }

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
    let conv = {
      name: this.convInfos.name,
      description: this.convInfos.description,
      theme: this.selectedTheme,
    };

    this.convService.update(conv, this.file).subscribe(async (res: any) => {
      this.convInfos = res;
      this.convInfos.photo = res.photo;
      localStorage.setItem('conv', JSON.stringify(res));
      this.convService.setConvChanged(res);
    });
    this.unselectConvPhoto();
  }
  mediasChange(event: any) {
    let fileInput = document.getElementById(
      'convPhotoInput'
    ) as HTMLInputElement;
    if (fileInput.files != null) {
      if (fileInput.files.length != 0) {
        this.file = event.target.files.item(0);
      }
    }
  }

  clickPhoto() {
    document.getElementById('convPhotoInput')?.click();
  }
  group() {
    let conv = JSON.parse(localStorage.getItem('conv') || '{}');
    let members = conv.members;
    return members.length > 2;
  }
  displayPhoto() {
    let cadrePhoto = document.getElementById('cadrePhoto') as HTMLImageElement;
    if (cadrePhoto.style.display == 'block') {
      cadrePhoto.style.display = 'none';
    } else {
      cadrePhoto.style.display = 'block';
    }
  }
  isGroupe() {
    let conv = JSON.parse(localStorage.getItem('conv') || '{}');
    return conv.type == 'groupe';
  }
  getSelectThemeClasses() {
    return {
      selectpicker: true,

      'bg-light': this.selectedTheme == 'basic',
      'bg-danger': this.selectedTheme == 'love',
      'bg-success': this.selectedTheme == 'spring',
      'bg-dark': this.selectedTheme == 'dark',
    };
  }
  getThemeClass(theme: string) {
    return {
      'bg-light': theme == 'basic',
      'bg-danger': theme == 'love',
      'bg-success': theme == 'spring',
      'bg-dark': theme == 'panda',
    };
  }
  fillSelectedFileName() {
    let fileInput = document.getElementById(
      'convPhotoInput'
    ) as HTMLInputElement;
    if (fileInput.files?.item(0) != null) {
      this.file = fileInput.files?.item(0);
      this.fileSelectedName = this.file.name;
    }
  }
  unselectConvPhoto() {
    let ConvPhotoForm = document.getElementById(
      'ConvPhotoForm'
    ) as HTMLFormElement;
    ConvPhotoForm.reset();
    this.file = null;
    this.fileSelectedName = '';
  }
}
