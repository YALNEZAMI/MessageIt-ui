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

  getConvFromConvs(id: string) {
    let convs = this.getThisConvs();
    let conv: any = {};
    convs.map((currentConv: any) => {
      if (currentConv._id == id) {
        conv = currentConv;
      }
    });
    return conv;
  }
  setConvToConvs(conv: any) {
    let convs = this.getThisConvs();
    convs = convs.map((currentConv: any) => {
      if (currentConv._id == conv._id) {
        return conv;
      }
      return currentConv;
    });
    this.setThisConvs(convs);
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
    console.log('logout');
    if (!this.thereIsToken()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    console.log('offline');

    this.offline().subscribe((data: any) => {
      console.log('offline');
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
    const id = this.getThisUser()._id;
    localStorage.clear();
    let userReturned: any = this.http.patch(
      `${env.api_url}/session/setStatus/${id}`,
      { status: 'offline' }
    );
    return userReturned;
  }
  isAuthenticated() {
    return localStorage.getItem('user') != null;
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
    let convs = JSON.parse(localStorage.getItem('convs') || '{}');

    return convs;
  }
  setThisConvs(convs: any) {
    localStorage.setItem('convs', JSON.stringify(convs));
  }

  setConvFromConvs(conv: any) {
    const messages = this.getConvById(conv._id).messages;
    conv.messages = messages;
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
  getConvById(id: string) {
    let convs = this.getThisConvs();
    let conv: any = {};
    convs.map((currentConv: any) => {
      if (currentConv._id == id) {
        conv = currentConv;
      }
    });
    return conv;
  }
  convExistWith(idUser: string) {
    let convs = this.getThisConvs();
    let result: any = { bool: false, conv: null };
    convs.map((currentConv: any) => {
      if (currentConv.type == 'private') {
        currentConv.members.map((member: any) => {
          if (member._id == idUser) {
            (result.bool = true), (result.conv = currentConv);
          }
        });
      }
    });
    return result;
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
  newViewver(idConv: string, idUser: string) {
    if (this.thereAreConvs()) {
      let convs = this.getThisConvs();
      convs = convs.map((conv: any) => {
        if (conv._id == idConv && conv.lastMessage != null) {
          if (!conv.lastMessage.vus.includes(idUser)) {
            conv.lastMessage.vus.push(idUser);
          }
          conv.messages = conv.messages.map((msg: any) => {
            if (!msg.vus.includes(idUser)) {
              msg.vus.push(idUser);
            }
            return msg;
          });
        }
        return conv;
      });
      this.setThisConvs(convs);
    }
  }
  newReciever(message: any) {
    if (this.thereAreConvs()) {
      let convs = this.getThisConvs();
      convs = convs.map((conv: any) => {
        if (conv._id == message.conv && conv.lastMessage != null) {
          conv.lastMessage.recievedBy = message.recievedBy;
          conv.messages = conv.messages.map((msg: any) => {
            if (msg._id == message._id) {
              msg.recievedBy = message.recievedBy;
            }
            return msg;
          });
        }
        return conv;
      });

      this.setThisConvs(convs);
    }
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
  thereAreMessages(convIdParam: any) {
    let convs = this.getThisConvs();
    let res = false;
    convs.map((currentConv: any) => {
      if (currentConv._id == convIdParam) {
        res = true;
      }
    });
    return res;
  }
  getThisMessages() {
    let conv = this.getThisConv();
    let convs = this.getThisConvs();
    let res: any[] = [];
    convs.map((currentConv: any) => {
      if (currentConv._id == conv._id) {
        res = currentConv.messages;
      }
    });
    return res;
  }
  getMessagesFromConvs(idConv: string) {
    let convs = this.getThisConvs();
    let res: any[] = [];
    convs.map((currentConv: any) => {
      if (currentConv._id == idConv) {
        res = currentConv.messages;
      }
    });
    return res;
  }
  setThisMessages(messages: any) {
    let conv = this.getThisConv();
    let convs = this.getThisConvs();
    convs = convs.map((currentConv: any) => {
      if (currentConv._id == conv._id) {
        currentConv.messages = messages;
      }
      return currentConv;
    });
    this.setThisConvs(convs);
  }
  setMessagesToConvs(messages: any, idConv: string) {
    let convs = this.getThisConvs();
    convs = convs.map((currentConv: any) => {
      if (currentConv._id == idConv) {
        currentConv.messages = messages;
      }
      return currentConv;
    });
    this.setThisConvs(convs);
  }
  addMessage(message: any) {
    if (this.thereAreMessages(message.conv)) {
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
  putConvAtTheTop(idConv: string) {
    let convs = this.getThisConvs();
    let conv: any = {};
    convs.map((currentConv: any) => {
      if (currentConv._id == idConv) {
        conv = currentConv;
      }
    });
    convs = convs.filter((currentConv: any) => {
      return currentConv._id != idConv;
    });
    convs.unshift(conv);
    this.setThisConvs(convs);
  }
  addMessageToConvs(message: any) {
    let convs = this.getThisConvs();
    let alreadyExist = false;
    convs = convs.map((conv: any) => {
      if (conv._id == message.conv) {
        conv.messages.map((msg: any) => {
          if (msg._id == message._id) {
            alreadyExist = true;
          }
        });
        if (!alreadyExist) {
          conv.messages.push(message);
        }
      }

      return conv;
    });
    this.setThisConvs(convs);
  }
  removeMsgFromConvs(idMsg: string) {
    let convs = this.getThisConvs();
    convs = convs.map((conv: any) => {
      conv.messages = conv.messages.filter((msg: any) => {
        return msg._id != idMsg;
      });

      return conv;
    });
    this.setThisConvs(convs);
  }
  appendUp(msgs: any[]) {
    let messages = this.getThisMessages();

    messages = msgs.concat(messages);

    this.setThisMessages(messages);
  }
  setReaction(reaction: any) {
    if (this.thereAreMessages(reaction.message.conv)) {
      let messages = this.getMessagesFromConvs(reaction.message.conv);

      messages = messages.map((msg: any) => {
        if (msg._id == reaction.message._id) {
          if (reaction.type == 'none') {
            //delete reaction case
            msg.reactions = msg.reactions.filter((reac: any) => {
              return reac.user._id != reaction.user._id;
            });
          } else {
            let add = true;
            msg.reactions = msg.reactions.map((reac: any) => {
              if (reac.user._id == reaction.user._id) {
                //update reaction case
                reac.type = reaction.type;
                add = false;
              }
              return reac;
            });
            if (add) {
              //add reaction case
              msg.reactions.push(reaction);
            }
          }
        }
        return msg;
      });

      this.setMessagesToConvs(messages, reaction.message.conv);
    }
  }
  setStatusInLocalStorage(user: any) {
    if (!this.isAuthenticated) return;
    let periode = 10;
    if (!this.thereAreConvs()) {
      periode = 5000;
    }
    setTimeout(() => {
      //set members in convs
      let convs = this.getThisConvs();
      convs = convs.map((conv: any) => {
        conv.members = conv.members.map((member: any) => {
          if (member._id == user._id) {
            member.status = user.status;
          }
          return member;
        });
        return conv;
      });
      this.setThisConvs(convs);
      //set friends status
      let friends = this.getThisFriends();
      console.log('friends', friends);
      friends = friends.map((friend: any) => {
        if (friend._id == user._id) {
          friend.status = user.status;
        }
        return friend;
      });
      this.setThisFriends(friends);
    }, periode);
  }
  getToken() {
    return localStorage.getItem('token');
  }
  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  thereIsToken() {
    return localStorage.getItem('token') != null;
  }
  updateOtherUser(user: any) {
    //set friends
    let friends = this.getThisFriends();
    friends = friends.map((friend: any) => {
      if (friend._id == user._id) {
        friend = user;
      }
      return friend;
    });
    this.setThisFriends(friends);
    //set convs members
    let convs = this.getThisConvs();
    convs = convs.map((conv: any) => {
      conv.members = conv.members.map((member: any) => {
        if (member._id == user._id) {
          member = user;
        }
        return member;
      });
      return conv;
    });
    this.setThisConvs(convs);
  }
}
