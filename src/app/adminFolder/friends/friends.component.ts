import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConvService } from 'src/app/Services/conv.service';
import { FriendService } from 'src/app/Services/friend.service';
import { UserService } from 'src/app/Services/user.service';
import { env } from 'src/env';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css'],
})
export class FriendsComponent {
  done: boolean = false;
  noRes: boolean = false;
  users: any;
  constructor(
    private friendService: FriendService,
    private convService: ConvService,
    private router: Router,
    private userService: UserService
  ) {
    this.friendService.getMyFriends().subscribe((friends) => {
      this.users = friends;

      if (this.users.length == 0) {
        this.noRes = true;
      }
      this.done = true;
    });
  }
  getContenuBtn(user: any): void {
    const operation: string = user.operation;
    let btn: any;
    switch (operation) {
      case 'add':
        btn = document.getElementById(user._id + '-Btn1');
        if (btn != null) {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
          <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
          <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
        </svg>`;
        }

        break;
      case 'remove':
        btn = document.getElementById(user._id + '-Btn1');
        if (btn != null) {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-dash-fill" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        </svg>`;
        }

        break;
      case 'cancel':
        btn = document.getElementById(user._id + '-Btn1');
        if (btn != null) {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>`;
        }

        break;
      case 'accept':
        btn = document.getElementById(user._id + '-Btn1');
        if (btn != null) {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
          <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
          <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
        </svg>`;
        }

        break;
    }
  }

  async operation(user: any) {
    switch (user.operation) {
      case 'add':
        this.friendService.add(user._id).subscribe((data: any) => {});
        break;
      case 'remove':
        this.friendService.remove(user._id).subscribe((data: any) => {
          document.getElementById(user._id)?.remove();
        });
        break;
      case 'cancel':
        this.friendService.cancel(user._id).subscribe((data: any) => {});
        break;
      case 'refuse':
        this.friendService.refuse(user._id).subscribe((data: any) => {});
        break;
      case 'accept':
        this.friendService.accept(user._id).subscribe((data: any) => {});
        break;
      case 'chat':
        if (document.getElementById(user._id + '-ChatBtn') != null) {
          let chatBtn =
            document.getElementById(user._id + '-ChatBtn') ||
            document.createElement('button');
          chatBtn.innerHTML = `...`;
        }

        this.convService.createConv(user._id).subscribe(async (data: any) => {
          try {
            let realData = await data;
            localStorage.setItem('conv', JSON.stringify(realData));
            this.router.navigate(['/conv/messages']);
          } catch (error) {
            console.log(error);
          }
        });
        break;

      default:
        console.log('default operation');

        break;
    }
  }

  getStatusClasses(user: any) {
    return this.userService.getStatusClassesForUser(user);
  }
}
