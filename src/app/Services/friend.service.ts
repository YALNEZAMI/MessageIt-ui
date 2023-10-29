import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/env';
import { WebSocketService } from './webSocket.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class FriendService {
  uri = env.api_url;
  nbrNotifChanged: Subject<any> = new Subject<any>();
  constructor(
    private Http: HttpClient,
    private webSocketService: WebSocketService,
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
  getNbrNotifs() {
    return this.nbrNotifChanged.asObservable();
  }
  resetAcceptedFriendRequest() {
    return this.Http.patch(
      `${this.uri}/user/resetAccepters/${this.getThisUser()._id}`,
      ''
    );
  }
}
