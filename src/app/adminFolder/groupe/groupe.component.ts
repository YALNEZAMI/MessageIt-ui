import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FriendService } from 'src/app/Services/friend.service';
import { SessionService } from 'src/app/Services/session.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-groupe',
  templateUrl: './groupe.component.html',
  styleUrls: ['./groupe.component.css'],
})
export class GroupeComponent {
  private friends: any[] = [];
  private selectedFriends: any[] = [];
  private conv: {
    name: string;
    members: string[];
  } = { name: '', members: [] };
  noRes: boolean = false;
  done: boolean = false;

  constructor(
    private friendService: FriendService,
    private router: Router,
    private sessionService: SessionService,
    private webSocketService: WebSocketService
  ) {
    if (this.sessionService.thereAreFriends()) {
      this.friends = this.sessionService.getThisFriends();
      this.done = true;
      if (this.friends.length == 0) {
        this.noRes = true;
      }
    } else {
      this.friendService.getMyFriends().subscribe((friends: any) => {
        this.friends = friends;
        this.friends = this.friends.concat(this.friends);
        this.friends = this.friends.concat(this.friends);
        this.friends = this.friends.concat(this.friends);

        if (this.friends.length == 0) {
          this.noRes = true;
        }
        this.done = true;
      });
    }
    //subscribe to add friend
    this.webSocketService.onAcceptFriend().subscribe((data: any) => {
      this.friends = this.sessionService.getThisFriends();
      this.done = true;
      if (this.friends.length == 0) {
        this.noRes = true;
      }
    });
    //subscribe to delete friend
    this.webSocketService.onRemoveFriend().subscribe((data: any) => {
      this.friends = this.sessionService.getThisFriends();
      this.friends = this.sessionService.getThisFriends();
      this.done = true;
      if (this.friends.length == 0) {
        this.noRes = true;
      }
    });
  }

  getFriends() {
    return this.friends;
  }
  getSelectedFriends() {
    return this.selectedFriends;
  }
  selectUser(user: any) {
    if (this.selectedFriends.includes(user)) {
      this.selectedFriends.splice(this.selectedFriends.indexOf(user), 1);
    } else {
      this.selectedFriends.push(user);
    }
  }
  makeGroupe() {
    this.friendService.makeGroupe(this.getConv()).subscribe((groupe: any) => {
      localStorage.setItem('conv', JSON.stringify(groupe));
      this.router.navigate(['/conv/messages']);
    });
  }
  getConv() {
    let idsArray: string[] = [];
    this.selectedFriends.forEach((user) => {
      idsArray.push(user._id);
    });
    this.conv.members = idsArray;
    return this.conv;
  }
  noFriends() {
    return this.sessionService.getThisFriends().length == 0;
  }
}
