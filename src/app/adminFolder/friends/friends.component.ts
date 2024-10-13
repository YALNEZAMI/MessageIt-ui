import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConvService } from 'src/app/Services/conv.service';
import { FriendService } from 'src/app/Services/friend.service';
import { SessionService } from 'src/app/Services/session.service';
import { UserService } from 'src/app/Services/user.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';
import { User } from 'src/app/Interfaces/User.interface';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent {
  done: boolean = false;
  noRes: boolean = false;
  friends: User[] = [];
  constructor(
    private friendService: FriendService,
    private convService: ConvService,
    private router: Router,
    private userService: UserService,
    private webSocketService: WebSocketService,
    private sessionService: SessionService
  ) {
    if (this.sessionService.thereAreFriends()) {
      //get Initial Data
      this.friends = this.sessionService.getThisFriends();

      //mark as done
      this.done = true;
    } else {
      this.friendService.getMyFriends().subscribe((friends: any) => {
        this.friends = friends;
        //set local storage
        this.sessionService.setThisFriends(this.friends);
        this.done = true;
        if (this.friends.length == 0) {
          this.noRes = true;
        }
      });
    }
    //set remove friend event
    this.webSocketService
      .onRemoveFriend()
      .subscribe((obj: { remover: string; removed: string }) => {
        this.friends = this.sessionService.getThisFriends();
      });
    //set to add friend
    this.webSocketService
      .onAcceptFriend()
      .subscribe((object: { accepter: any; accepted: any }) => {
        this.friends = this.sessionService.getThisFriends();
      });
    //statusChange websocket subscription
    this.webSocketService.statusChange().subscribe((user: any) => {
      this.friends.map((currentUser: any) => {
        if (currentUser._id == user._id) {
          currentUser.status = user.status;
        }
      });
    });
  }
  getFriends(): User[] {
    this.friends = this.friends.map((friend: User) => {
      if (friend.operation == undefined || friend.operation == null) {
        friend.operation = 'remove';
      }
      return friend;
    });
    return this.friends;
  }
  getContenuBtn(user: any): void {
    let btn = document.getElementById(user._id + '-Btn1');
    if (btn != null) {
      btn.innerHTML = this.friendService.getBtnContent(user);
    }
  }

  async operation(user: any) {
    return await this.friendService.friendOperations(user);
  }

  getStatusClasses(user: any) {
    return this.userService.getStatusClassesForUser(user);
  }
  getNoRes() {
    return this.friends.length == 0;
  }
}
