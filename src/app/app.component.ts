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
export class AppComponent implements OnDestroy {
  title = 'front';
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: any): void {
    let token = '';
    let thereIsToken = this.sessionService.thereIsToken();
    if (thereIsToken) {
      token = this.sessionService.getToken() || '';
    }
    localStorage.clear();
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
    if (this.sessionService.thereIsToken()) {
      let thereIsToken = this.sessionService.thereIsToken();
      if (thereIsToken) {
        let token = this.sessionService.getToken() || '';
        this.userService.getUserById(token).subscribe((user: any) => {
          this.sessionService.setThisUser(user);
          this.convService.getConvs().subscribe(async (convs: any) => {
            //set convs in local storage
            this.sessionService.setThisConvs(convs);
            this.router.navigate(['admin/convs']);
          });
        });
      }
    } else {
      this.sessionService.logout();
    }
  }

  ngOnDestroy(): void {}
}
