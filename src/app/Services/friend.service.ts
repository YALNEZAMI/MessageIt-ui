import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/env';

@Injectable()
export class FriendService {
  uri = env.api_url;
  user = localStorage.getItem('user');

  constructor(private Http: HttpClient) {}

  getMyId() {
    if (this.user != null) {
      return JSON.parse(this.user)._id;
    }
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
}
