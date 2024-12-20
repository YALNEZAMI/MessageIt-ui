import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConvService } from 'src/app/Services/conv.service';
import { FriendService } from 'src/app/Services/friend.service';
import { SessionService } from 'src/app/Services/session.service';
import { UserService } from 'src/app/Services/user.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-add-member-conv',
  templateUrl: './add-member-conv.component.html',
  styleUrls: ['./add-member-conv.component.css'],
})
export class AddMemberConvComponent {
  private friends: any[] = [1];
  private selectedFriends: any[] = [];
  noRes: boolean = false;
  done: boolean = false;

  constructor(
    private friendService: FriendService,
    private convService: ConvService,
    private webSocketService: WebSocketService,
    private sessionService: SessionService,
    private userService: UserService,
    private router: Router
  ) {
    if (this.sessionService.thereAreMembers()) {
      this.friends = this.sessionService.getThisMembersToAdd();

      if (this.friends.length == 0) {
        this.noRes = true;
      }
      this.done = true;
    } else {
      this.friendService.getFriendsToAdd().subscribe((friends: any) => {
        this.friends = friends;
        if (this.friends.length == 0) {
          this.noRes = true;
        }
        this.done = true;
      });
    }

    //subscribe to add member to groupe event
    this.webSocketService
      .onAddMemberToGroupe()
      .subscribe((convAndNewMembers: any) => {
        this.friends = this.sessionService.getThisMembersToAdd();
        // if (convAndNewMembers.conv._id == this.getThisConv()._id) {
        //   let newMembers = convAndNewMembers.members;
        //   for (let member of newMembers) {
        //     this.friends = this.friends.filter((user) => user._id != member);
        //     document.getElementById(member)?.remove();
        //   }
        // }
      });
  }
  //get css classes according to the user status (online,offline...)
  getStatusClasses(user: any) {
    return this.userService.getStatusClassesForUser(user);
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
  addMembers() {
    let membersIds = this.getNewMembers();

    this.convService.addMembers(membersIds).subscribe((conv: any) => {
      this.setThisConv(conv);
      for (let member of conv.members) {
        this.friends = this.friends.filter((user) => user._id != member._id);
        document.getElementById(member._id)?.remove();
      }
      // this.router.navigate(['/conv/members']);
    });
  }
  setThisConv(conv: any) {
    localStorage.setItem('conv', JSON.stringify(conv));
  }
  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  getThisConv() {
    return JSON.parse(localStorage.getItem('conv') || '{}');
  }
  getNewMembers() {
    let setMembers = new Set();

    this.selectedFriends.forEach((user) => {
      setMembers.add(user._id);
    });

    let array = Array.from(setMembers);
    return array;
  }
  cancel() {
    this.router.navigate(['/conv/members']);
  }
}
