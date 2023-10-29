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
export class NavBarComponent {
  nbrNotifs = 0;
  constructor(
    private router: Router,
    private friendService: FriendService,
    private webSocketService: WebSocketService,
    private sessionService: SessionService
  ) {
    if (this.getThisUser() != null) {
      this.friendService.friendReqSentToMe().subscribe(async (data: any) => {
        this.nbrNotifs = await data.length;
      });
      this.webSocketService.onAddFriend().subscribe((data: any) => {
        if (data.reciever._id == this.getThisUser()._id) this.nbrNotifs++;
      });
      this.webSocketService.onCancelFriend().subscribe((data: any) => {
        if (data.canceled == this.getThisUser()._id) this.nbrNotifs--;
      });
      //get the number of notifications after performing an operation in the notif component
      this.friendService.getNbrNotifs().subscribe((nbr: any) => {
        this.nbrNotifs = nbr;
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
