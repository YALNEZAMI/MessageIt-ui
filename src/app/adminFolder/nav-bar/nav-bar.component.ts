import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FriendService } from 'src/app/Services/friend.service';
import { UserService } from 'src/app/Services/user.service';

import { SessionService } from 'src/app/Services/session.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  nbrNotifs = 0;
  constructor(
    private router: Router,
    private friendService: FriendService,
    private webSocketService: WebSocketService,
    private sessionService: SessionService,
    private userService: UserService
  ) {
    //getInitialNotifs from local storage
    if (this.sessionService.isAuthenticated()) {
      if (this.sessionService.therAreNotifs()) {
        this.nbrNotifs = this.sessionService.getThisNotifs().length;
      } else {
        //getInitialNotifs from server
        this.friendService.friendReqSentToMe().subscribe(async (data: any) => {
          this.nbrNotifs = await data.length;
          //set local storage
          this.sessionService.setThisNotifs(data);
        });
      }
      this.webSocketService.onAddFriend().subscribe((data: any) => {
        this.nbrNotifs = this.sessionService.getThisNotifs().length;
      });
      this.webSocketService.onCancelFriend().subscribe((data: any) => {
        this.nbrNotifs = this.sessionService.getThisNotifs().length;
      });

      //accept friend request event
      this.webSocketService.onAcceptFriend().subscribe((data: any) => {
        this.nbrNotifs = this.sessionService.getThisNotifs().length;
      });
    }
  }

  getCurrentUser() {
    return this.userService.getCurrentUser();
  }
  goTo(path: string): void {
    this.router.navigate([path]);
  }

  getFinalPath() {
    let url = this.router.url;
    let splitted = url.split('/');
    let res = '';
    splitted.map((p, i) => {
      if (p && i != 0) {
        res += '/' + p;
      }
    });

    return res;
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
  getNbrNotifs() {
    return this.sessionService.getThisNotifs().length;
  }
  getTailwindThemeClesses() {
    return this.userService.getTailwindThemeClasses();
  }
  getSelectorLeft() {
    switch (this.getFinalPath()) {
      case '/admin/convs':
        return '10%';
      case '/admin/profile':
        return '27%';
      case '/admin/notifs':
        return '45%';
      case '/admin/search':
        return '64%';
      case '/admin/search/users':
        return '64%';
      case '/admin/search/convs':
        return '64%';
      case '/admin/friends':
        return '82%';
      default:
        return '100%';
        break;
    }
  }
}
