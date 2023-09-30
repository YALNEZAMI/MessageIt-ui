import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
// import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  constructor(private router: Router) {}
  goToNotifs() {
    this.router.navigate(['admin/notifs']);
  }
  goToConvs() {
    this.router.navigate(['admin/convs']);
  }
  goToProfile() {
    this.router.navigate(['admin/profile']);
  }
  goToSearch() {
    this.router.navigate(['admin/search/users']);
  }
  goToFriends() {
    this.router.navigate(['admin/friends']);
  }
  get2Route() {
    let url = this.router.url;
    let splitted = url.split('/');

    return splitted[splitted.length - 2] + '/' + splitted[splitted.length - 1];
    // switch (last2Routes) {
    //   case 'admin/convs':
    //     break;
    //   case 'admin/profile':
    //     break;
    //   case 'admin/notifs':
    //     break;
    //   case 'search/users':
    //     break;
    //   case 'search/convs':
    //     break;
    //     case 'admin/friends':
    //     break;

    //   default:
    //     break;
    // }
  }
}
