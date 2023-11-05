import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import { env } from 'src/env';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css'],
})
export class HeaderAdminComponent {
  name: any;
  // photo = '';
  constructor(private router: Router, private userService: UserService) {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    this.name = user.firstName + ' ' + user.lastName;

    this.userService.getNameChanged().subscribe((name) => {
      this.name = name;
    });
  }
  getMyPhoto() {
    return JSON.parse(localStorage.getItem('user') || '{}').photo;
  }
  getMe() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  goToProfile() {
    this.router.navigate(['/admin/profile']);
  }
}
