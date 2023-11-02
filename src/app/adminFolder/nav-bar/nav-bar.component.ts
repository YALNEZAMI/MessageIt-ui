import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FriendService } from 'src/app/Services/friend.service';
import { SessionService } from 'src/app/Services/session.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
//FIXME addreq disparition on closing navbar
//TODO test convs deleting intervall
export class NavBarComponent {
  nbrNotifs = 0;
  constructor(
    private router: Router,
    private friendService: FriendService,
    private webSocketService: WebSocketService,
    private sessionService: SessionService
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
  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

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
  getNbrNotifs() {
    return this.sessionService.getThisNotifs().length;
  }
}
