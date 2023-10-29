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
  getThisFriends() {
    return this.getThisUser().friends;
  }
  removeFriend(id: string) {
    let user = this.getThisUser();
    user.friends = user.friends.filter((friend: any) => friend._id != id);
    this.setThisUser(user);
  }
  alreadyFriend(id: string) {
    return this.getThisUser().friends.some((friend: any) => friend._id == id);
  }
  addFriend(friend: any) {
    if (this.alreadyFriend(friend._id)) return;
    let user = this.getThisUser();
    user.friends.unshift(friend);
    this.setThisUser(user);
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
    notifs.unshift(notif);
    this.setThisNotifs(notifs);
  }
  removeNotif(id: string) {
    let notifs = this.getThisNotifs();
    notifs = notifs.filter((notif: any) => notif._id != id);
    this.setThisNotifs(notifs);
  }
}
