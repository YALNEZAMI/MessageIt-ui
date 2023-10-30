import { Injectable } from '@angular/core';

import { env } from 'src/env';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  user: any;
  conv: any;
  constructor(private router: Router, private http: HttpClient) {}
  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  getThisConv() {
    return JSON.parse(localStorage.getItem('conv') || '{}');
  }
  setThisUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    //set status online
    this.online().subscribe((data: any) => {});
  }
  setConv(conv: any) {
    localStorage.setItem('conv', JSON.stringify(conv));
  }

  async logout() {
    this.offline().subscribe((data: any) => {
      setTimeout(() => {
        //clear first time to avoid redirection from auth
        localStorage.clear();
        this.router.navigate(['/auth/login']);
      }, 500);

      setTimeout(() => {
        //clear second time to delete any data that may be added after redirection(it happens sometimes)
        localStorage.clear();
      }, 1000);
    });
  }
  online() {
    let userReturned: any = this.http.patch(
      `${env.api_url}/session/setStatus/${this.getThisUser()._id}`,
      { status: 'online' }
    );
    return userReturned;
  }
  offline() {
    let userReturned: any = this.http.patch(
      `${env.api_url}/session/setStatus/${this.getThisUser()._id}`,
      { status: 'offline' }
    );
    return userReturned;
  }
  isAuthenticated() {
    return this.getThisUser() != null;
  }
  thereIsConv() {
    return localStorage.getItem('conv') != null;
  }
  thereAreConvs() {
    return localStorage.getItem('convs') != null;
  }
  getThisConvs() {
    return JSON.parse(localStorage.getItem('convs') || '{}');
  }
  setThisConvs(convs: any) {
    localStorage.setItem('convs', JSON.stringify(convs));
  }
  addConv(conv: any) {
    let convs = this.getThisConvs();
    convs.unshift(conv);
    this.setThisConvs(convs);
  }
  removeConv(id: string) {
    let convs = this.getThisConvs();
    convs = convs.filter((conv: any) => conv._id != id);
    this.setThisConvs(convs);
  }
  thereIsUser() {
    return localStorage.getItem('user') != null;
  }

  therAreNotifs() {
    return localStorage.getItem('notifs') != null;
  }
  getThisNotifs() {
    return JSON.parse(localStorage.getItem('notifs') || '{}');
  }
  setThisNotifs(notifs: any) {
    localStorage.setItem('notifs', JSON.stringify(notifs));
  }
  addNotif(notif: any) {
    let notifs = this.getThisNotifs();

    let alreadyExist = false;
    notifs.map((currentNotif: any) => {
      if (
        currentNotif.type == notif.type &&
        currentNotif.user._id == notif.user._id
      ) {
        alreadyExist = true;
      }
    });
    if (!alreadyExist) {
      notifs.unshift(notif);
      this.setThisNotifs(notifs);
    }
  }
  iAccept(senderId: string) {
    let notifs = this.getThisNotifs();

    notifs = notifs.map((notif: any) => {
      if (notif.type == 'addReq' && notif.user._id == senderId) {
        notif.user.operation = 'remove';
        notif.type = 'accepted';
      }
      return notif;
    });
    this.setThisNotifs(notifs);
  }
  thereAreFriends() {
    return localStorage.getItem('friends') != null;
  }
  getThisFriends() {
    return JSON.parse(localStorage.getItem('friends') || '{}');
  }
  setThisFriends(friends: any) {
    localStorage.setItem('friends', JSON.stringify(friends));
  }

  alreadyFriend(id: string) {
    return this.getThisFriends().some((friend: any) => friend._id == id);
  }
  addFriend(friend: any) {
    if (!this.alreadyFriend(friend._id)) {
      let friends = this.getThisFriends();
      friends.unshift(friend);
      this.setThisFriends(friends);
    }
  }
  removeFriend(id: string) {
    let friends = this.getThisFriends();
    friends = friends.filter((friend: any) => friend._id != id);
    this.setThisFriends(friends);
  }
}
