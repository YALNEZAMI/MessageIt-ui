import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/Services/session.service';
import { SideBarService } from 'src/app/Services/side-bar.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-admin-side-bar',
  templateUrl: './admin-side-bar.component.html',
  styleUrl: './admin-side-bar.component.css',
})
export class AdminSideBarComponent {
  logingOut = false;
  disapeared = false;

  constructor(
    private sessionService: SessionService,
    private sidebarService: SideBarService,
    private router: Router,
    private userService: UserService
  ) {}
  async logout() {
    this.logingOut = true;
    await this.sessionService.logout();
    this.disapear();
  }
  disapear() {
    this.sidebarService.setSideBarVisible(false);
  }
  goToGroupe() {
    this.disapear();
    this.router.navigate(['/admin/groupe']);
  }
  getThirdCommonColor() {
    return this.userService.getThirdCommonColor();
  }
}
