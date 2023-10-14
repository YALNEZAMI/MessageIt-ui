import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FriendService } from 'src/app/Services/friend.service';

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

  constructor(private friendService: FriendService, private router: Router) {
    this.friendService.getMyFriends().subscribe((friends: any) => {
      this.friends = friends;

      if (this.friends.length == 0) {
        console.log('no friends');
        this.noRes = true;
      }
      this.done = true;
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
}
