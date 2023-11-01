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
    localStorage.setItem('friends', JSON.stringify(user.friends));
    //set status online
    this.online().subscribe((data: any) => {});
  }
  setThisConv(conv: any) {
    localStorage.setItem('conv', JSON.stringify(conv));
    localStorage.setItem('members', JSON.stringify(conv.members));
    if (!this.thereAreMedias()) {
      localStorage.setItem('medias', JSON.stringify([]));
    }
  }
  thereAreMembers() {
    return localStorage.getItem('members') != null;
  }
  getThisMembers() {
    return JSON.parse(localStorage.getItem('members') || '{}');
  }
  // updateMembers() {
  //   if(this.thereIsConv()){
  //   localStorage.setItem('members', JSON.stringify(this.getThisConv().members));
  //   }
  // }

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
  removeConvFromLocalStorage() {
    localStorage.removeItem('conv');
    localStorage.removeItem('members');
    localStorage.removeItem('medias');
    localStorage.removeItem('messages');
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
  setConvFromConvs(conv: any) {
    let convs = this.getThisConvs();
    convs = convs.map((currentConv: any) => {
      if (currentConv._id == conv._id) {
        return conv;
      }
      return currentConv;
    });
    this.setThisConvs(convs);
  }
  addConv(conv: any) {
    let convs = this.getThisConvs();
    let alreadyExist = false;
    convs.map((currentConv: any) => {
      if (currentConv._id == conv._id) {
        alreadyExist = true;
      }
    });
    if (!alreadyExist) {
      let amIn = false;
      conv.members.map((member: any) => {
        if (member._id == this.getThisUser()._id) {
          amIn = true;
        }
      });
      if (amIn) {
        convs.unshift(conv);
        this.setThisConvs(convs);
      }
    }
  }
  IsAmongMyConvs(id: string) {
    let convs = this.getThisConvs();
    let isAmong = false;
    convs.map((conv: any) => {
      if (conv._id == id) {
        isAmong = true;
      }
    });
    return isAmong;
  }
  removeConvFromConvs(id: string) {
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
  getThisMembersToAdd() {
    let convMembers = this.getThisMembers();
    let friends = this.getThisFriends();

    convMembers.map((member: any) => {
      friends = friends.filter((friend: any) => friend._id != member._id);
    });

    return friends;
  }
  setLastMessage(message: any) {
    let convs = this.getThisConvs();

    convs = convs.map((conv: any) => {
      if (conv._id == message.conv) {
        conv.lastMessage = message;
      }
      return conv;
    });

    this.setThisConvs(convs);
  }
  setLastMessageAsSeen() {
    let convs = this.getThisConvs();

    convs = convs.map((conv: any) => {
      if (conv._id == this.getThisConv()._id) {
        if (conv.lastMessage != null && conv.lastMessage != undefined) {
          conv.lastMessage.vus.push(this.getThisUser()._id);
        }
      }
      return conv;
    });

    this.setThisConvs(convs);
  }
  thereAreMedias() {
    return localStorage.getItem('medias') != null;
  }
  getThisMedias() {
    return JSON.parse(localStorage.getItem('medias') || '{}');
  }
  setThisMedias(medias: any) {
    localStorage.setItem('medias', JSON.stringify(medias));
  }
  addMedia(media: any) {
    let medias = this.getThisMedias();
    medias.unshift(media);
    this.setThisMedias(medias);
  }
  thereAreMessages() {
    return localStorage.getItem('messages') != null;
  }
  getThisMessages() {
    return JSON.parse(localStorage.getItem('messages') || '{}');
  }
  setThisMessages(messages: any) {
    localStorage.setItem('messages', JSON.stringify(messages));
  }
  addMessage(message: any) {
    let messages = this.getThisMessages();
    //avoid duplication
    let alreadyExist = false;
    messages.map((msg: any) => {
      if (msg._id == message._id) {
        alreadyExist = true;
      }
    });
    if (!alreadyExist) {
      messages.push(message);
      this.setThisMessages(messages);
    }
  }
}
