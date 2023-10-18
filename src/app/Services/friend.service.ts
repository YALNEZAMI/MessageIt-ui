import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/env';
import { WebSocketService } from './webSocket.service';
import { Subject } from 'rxjs';

@Injectable()
export class FriendService {
  uri = env.api_url;
  nbrNotifChanged: Subject<any> = new Subject<any>();
  constructor(
    private Http: HttpClient,
    private webSocketService: WebSocketService
  ) {}

  getMyId() {
    return JSON.parse(localStorage.getItem('user') || '{}')._id;
  }
  add(id: string) {
    let body: { sender: string; reciever: string } = {
      sender: this.getMyId(),
      reciever: id,
    };
    return this.Http.post(`${this.uri}/user/friends`, body);
  }
  remove(id: string) {
    return this.Http.delete(`${this.uri}/user/friends/${this.getMyId()}/${id}`);
  }

  cancel(id: string) {
    return this.Http.delete(
      `${this.uri}/user/friends/cancel/${this.getMyId()}/${id}`
    );
  }
  refuse(id: string) {
    return this.Http.delete(
      `${this.uri}/user/friends/refuse/${this.getMyId()}/${id}`
    );
  }
  accept(id: string) {
    return this.Http.delete(
      `${this.uri}/user/friends/accept/${this.getMyId()}/${id}`
    );
  }
  findreqSentToMe() {
    return this.Http.get(`${this.uri}/user/findreqSentToMe/${this.getMyId()}`);
  }
  getMyFriends() {
    let id = this.getMyId();
    return this.Http.get(`${this.uri}/user/myFriends/${id}`);
  }
  getFriendsToAdd() {
    let membersIds = [];
    let conv = this.getThisConv();

    for (let member of conv.members) {
      membersIds.push(member._id);
    }

    return this.Http.post(
      `${this.uri}/user/friendsToAdd/${this.getMyId()}`,
      membersIds
    );
  }
  getThisConv() {
    return JSON.parse(localStorage.getItem('conv') || '{}');
  }
  makeGroupe(conv: any) {
    //add me
    conv.members.push(this.getMyId());
    //set type
    conv.type = 'groupe';
    //set admin
    conv.admins = [];
    conv.admins.push(this.getMyId());
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
}
