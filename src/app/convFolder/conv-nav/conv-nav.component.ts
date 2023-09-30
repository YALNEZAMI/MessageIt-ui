import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conv-nav',
  templateUrl: './conv-nav.component.html',
  styleUrls: ['./conv-nav.component.css'],
})
export class ConvNavComponent {
  constructor(private router: Router) {}
  goToMessages() {
    this.router.navigate(['conv/messages']);
  }
  goToMedias() {
    this.router.navigate(['conv/medias']);
  }

  goToSearch() {
    this.router.navigate(['conv/search']);
  }
  goToSettings() {
    this.router.navigate(['conv/settings']);
  }
  goToMembers() {
    this.router.navigate(['conv/members']);
  }
  get2Route() {
    let url = this.router.url;
    let splitted = url.split('/');

    return splitted[splitted.length - 2] + '/' + splitted[splitted.length - 1];
  }
}
