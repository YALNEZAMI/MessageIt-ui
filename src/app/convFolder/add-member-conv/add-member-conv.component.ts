import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConvService } from 'src/app/Services/conv.service';
import { FriendService } from 'src/app/Services/friend.service';

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
    private router: Router,
    private convService: ConvService
  ) {
    this.friendService.getMyFriends().subscribe((friends: any) => {
      this.friends = friends;

      if (this.friends.length == 0) {
        this.noRes = true;
      }
      this.done = true;
    });
  }

  getFriends() {
    this.friends = this.friends.filter((friend: any) => {
      !this.getThisConv().members.includes(friend._id);
    });
    if (this.friends.length == 0) {
      this.noRes = true;
    }
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
    this.convService.setMembers(this.getMembers()).subscribe((data: any) => {
      this.router.navigate(['/conv/members']);
    });
  }
  getThisConv() {
    return JSON.parse(localStorage.getItem('conv') || '{}');
  }
  getMembers() {
    let members: string[] = this.getThisConv().members;
    let idsArray: string[] = [];
    members.forEach((member: any) => {
      idsArray.push(member._id);
    });
    this.selectedFriends.forEach((user) => {
      idsArray.push(user._id);
    });
    return idsArray;
  }
}
