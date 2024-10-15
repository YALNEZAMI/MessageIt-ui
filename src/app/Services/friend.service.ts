import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import env from 'src/env';
// import { WebSocketService } from './webSocket.service';
import { Subject } from 'rxjs';
import { ConvService } from './conv.service';
import { Router } from '@angular/router';

@Injectable()
export class FriendService {
  uri = env.api_url;
  nbrNotifChanged: Subject<any> = new Subject<any>();
  constructor(
    private Http: HttpClient,
    private convService: ConvService,
    // private webSocketService: WebSocketService,
    private router: Router
  ) {}
  getThisUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  add(id: string) {
    let body: { sender: string; reciever: string } = {
      sender: this.getThisUser()._id,
      reciever: id,
    };
    return this.Http.post(`${this.uri}/user/friends`, body);
  }
  remove(id: string) {
    return this.Http.delete(
      `${this.uri}/user/friends/${this.getThisUser()._id}/${id}`
    );
  }

  cancel(id: string) {
    return this.Http.delete(
      `${this.uri}/user/friends/cancel/${this.getThisUser()._id}/${id}`
    );
  }
  refuse(id: string) {
    return this.Http.delete(
      `${this.uri}/user/friends/refuse/${this.getThisUser()._id}/${id}`
    );
  }
  accept(id: string) {
    return this.Http.delete(
      `${this.uri}/user/friends/accept/${this.getThisUser()._id}/${id}`
    );
  }
  friendReqSentToMe(): any {
    if (localStorage.getItem('user') != null) {
      return this.Http.get(
        `${this.uri}/user/findreqSentToMe/${this.getThisUser()._id}`
      );
    }
  }
  getMyFriends() {
    let id = this.getThisUser()._id;
    return this.Http.get(`${this.uri}/user/myFriends/${id}`);
  }
  getFriendsToAdd() {
    let membersIds = [];
    let conv = this.getThisConv();

    for (let member of conv.members) {
      membersIds.push(member._id);
    }

    return this.Http.post(
      `${this.uri}/user/friendsToAdd/${this.getThisUser()._id}`,
      membersIds
    );
  }
  getThisConv() {
    return JSON.parse(localStorage.getItem('conv') || '{}');
  }
  makeGroupe(conv: any) {
    //add me
    conv.members.push(this.getThisUser()._id);
    //set type
    conv.type = 'groupe';
    //set admin
    conv.admins = [];
    //set chef
    conv.chef = this.getThisUser()._id;
    //set createdAt
    conv.createdAt = new Date();
    return this.Http.post(`${this.uri}/conv/groupe`, conv);
  }
  setNbrNotifs(nbr: number) {
    this.nbrNotifChanged.next(nbr);
  }

  resetAcceptedFriendRequest() {
    return this.Http.patch(
      `${this.uri}/user/resetAccepters/${this.getThisUser()._id}`,
      ''
    );
  }
  //frinedOperations
  //@params user the user that's concerned by the operation
  //@return make the operation and return the new one
  async friendOperations(body: any) {
    switch (body.operation) {
      case 'add':
        this.add(body._id).subscribe((data: any) => {});
        break;
      case 'remove':
        this.remove(body._id).subscribe((data: any) => {
          // document.getElementById(user._id)?.remove();
          // this.users = this.users.filter(
          //   (currentUser: any) => currentUser._id != user._id
          // );
        });
        break;
      case 'cancel':
        this.cancel(body._id).subscribe((data: any) => {});
        break;
      case 'refuse':
        this.refuse(body._id).subscribe((data: any) => {});
        break;
      case 'accept':
        this.accept(body._id).subscribe((data: any) => {});
        break;
      case 'chat':
        if (document.getElementById(body._id + '-ChatBtn') != null) {
          let chatBtn =
            document.getElementById(body._id + '-ChatBtn') ||
            document.createElement('button');
          chatBtn.innerHTML = `...`;
        }

        this.convService.createConv(body._id).subscribe((conv: any) => {
          try {
            localStorage.setItem('conv', JSON.stringify(conv));
            this.router.navigate(['/conv/messages']);
          } catch (error) {
            console.log(error);
          }
        });
        break;

      default:
        break;
    }
  }
  getBtnContent(user: any): string {
    const operation: string = user.operation;
    switch (operation) {
      case 'add':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
          <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
          <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
        </svg>`;

        break;
      case 'remove':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-dash-fill" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        </svg>`;

        break;
      case 'cancel':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>`;

        break;
      case 'accept':
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
          <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
          <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
        </svg>`;

        break;
    }
    return '';
  }
}
