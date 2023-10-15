import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/env';

@Injectable()
export class FriendService {
  uri = env.api_url;
  constructor(private Http: HttpClient) {}

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
  makeGroupe(conv: any) {
    //add me
    conv.members.push(this.getMyId());
    return this.Http.post(`${this.uri}/conv/groupe`, conv);
  }
}
