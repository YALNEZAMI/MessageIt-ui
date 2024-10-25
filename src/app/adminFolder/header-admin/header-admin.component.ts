import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SideBarService } from 'src/app/Services/side-bar.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css'],
})
export class HeaderAdminComponent {
  name: any;
  constructor(
    private router: Router,
    private userService: UserService,
    private sidebarService: SideBarService
  ) {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    this.name = user.firstName;

    this.userService.getNameChanged().subscribe((name) => {
      this.name = name;
    });
  }
  getCurrentUser() {
    return this.userService.getThisUser();
  }
  goToProfile() {
    this.router.navigate(['/admin/profile']);
  }
  getTailwindThemeClesses() {
    return this.userService.getTailwindThemeClasses();
  }
}
