import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from './Services/session.service';
import { UserService } from './Services/user.service';
import { ConvService } from './Services/conv.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'front';
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: any): void {
    let token = '';
    let thereIsToken = this.sessionService.thereIsToken();
    if (thereIsToken) {
      token = this.sessionService.getToken() || '';
    }
    // localStorage.clear(); //TODO this line is commented while dev process
    if (thereIsToken) {
      this.sessionService.setToken(token);
    }
    // Perform actions before the page unloads (e.g., save data to local storage)
  }
  constructor(
    private sessionService: SessionService,
    private userService: UserService,
    private convService: ConvService,
    private router: Router
  ) {
    if (!this.sessionService.thereIsToken() && this.unauthorizedRoute()) {
      this.router.navigate(['auth/login']);
    }
  }
  ngOnInit(): void {
    if (
      this.sessionService.thereIsToken() &&
      !this.sessionService.isAuthenticated()
    ) {
      let token = this.sessionService.getToken() || '';
      this.userService.getUserById(token).subscribe((user: any) => {
        this.sessionService.setThisUser(user);
        this.convService.getConvs().subscribe(async (convs: any) => {
          //set convs in local storage
          this.sessionService.setThisConvs(convs);
          setTimeout(() => {
            this.router.navigate(['admin/convs']);
          }, 2000);
        });
      });
    } else if (this.sessionService.isAuthenticated()) {
      console.log('connected  !');
    } else {
      if (this.unauthorizedRoute()) {
        this.sessionService.logout();
      }
    }
  }
  unauthorizedRoute() {
    let url: any = this.router.url;
    url = url.split('/');
    let root = url[1];
    if (root == 'admin' || root == 'conv') {
      return true;
    }
    return false;
  }
  ngOnDestroy(): void {}
}
