import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';
// import {  WebSocketSubject } from 'rxjs/webSocket';

import { Message } from '../Interfaces/message.interface';
import { SessionService } from './session.service';
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  transferMessegeSent: any = new Subject<any>();
  transferMessegeResponse: any = new Subject<any>();
  searchKey: any = new Subject<any>();
  constructor(
    private socket: Socket, // private websocketSubject: WebSocketSubject<any>
    private sessionService: SessionService
  ) {}
  setThisConv(conv: any) {
    localStorage.setItem('conv', JSON.stringify(conv));
  }
  newMessage(): Observable<Message> {
    return new Observable<Message>((Observer) => {
      this.socket.on('newMessage', (message: any) => {
        Observer.next(message);
      });
    });
  }
  setVus(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('setVus', (object: any) => {
        //object:{myId:string,idConv:string}
        Observer.next(object);
      });
    });
  }
  messageDeleted(): Observable<any> {
    return new Observable<any>((Observer) => {
      // object:{idMsg:string,idUser:string,memberLength:number}
      this.socket.on('messageDeleted', (object: any) => {
        Observer.next(object);
      });
    });
  }
  typing(): Observable<any> {
    return new Observable<any>((Observer) => {
      // object:{idConv:string,user:any}
      this.socket.on('typing', (object: any) => {
        Observer.next(object);
      });
    });
  }
  onAddFriend(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('addFriend', (object: any) => {
        //chek if am concerned
        if (object.reciever._id == this.sessionService.getThisUser()._id) {
          //add notif  to local storage

          this.sessionService.addNotif({
            type: object.type,
            user: object.sender,
            date: object.date,
          });

          //propagate event
          Observer.next(object);
        }
      });
    });
  }
  onAcceptFriend(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on(
        'acceptFriend',
        (object: { accepter: any; accepted: any; date: Date }) => {
          //set local storage friends
          if (object.accepter._id == this.sessionService.getThisUser()._id) {
            this.sessionService.addFriend(object.accepted);
            this.sessionService.iAccept(object.accepted._id);
            Observer.next(object);
          }
          if (object.accepted._id == this.sessionService.getThisUser()._id) {
            this.sessionService.addFriend(object.accepter);
            //add a notif for accepted user
            this.sessionService.addNotif({
              type: 'acceptation',
              user: object.accepter,
              date: object.date,
            });
            Observer.next(object);
          }
        }
      );
    });
  }

  onCancelFriend(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('cancelFriend', (object: any) => {
        if (object.canceled == this.sessionService.getThisUser()._id) {
          let notifs = this.sessionService.getThisNotifs();
          notifs = notifs.filter((notif: any) => {
            return notif.user._id != object.canceler;
          });

          //set local storage
          this.sessionService.setThisNotifs(notifs);
        }
        Observer.next(object);
      });
    });
  }
  onLastMsg(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('lastMsg', (msg: any) => {
        Observer.next(msg);
      });
    });
  }
  onRemoveFromGroupe(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on(
        'removeFromGroupe',
        (object: { idUser: string; conv: any }) => {
          //set the new conv
          this.setThisConv(object.conv);
          Observer.next(object);
        }
      );
    });
  }
  onCreateConv(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('createConv', (conv: any) => {
        //set the new conv
        this.setThisConv(conv);

        Observer.next(conv);
      });
    });
  }
  onAddMemberToGroupe(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('addMemberToGroupe', (convAndNewMembers: any) => {
        //set the new conv
        this.setThisConv(convAndNewMembers.conv);
        Observer.next(convAndNewMembers);
      });
    });
  }
  onLeavingConv(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on(
        'leaveConv',
        (convAndLeaver: { conv: any; leaver: any }) => {
          //set the new conv
          this.setThisConv(convAndLeaver.conv);
          Observer.next(convAndLeaver);
        }
      );
    });
  }
  onRecievedMessage(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('recievedMessage', (message: any) => {
        Observer.next(message);
      });
    });
  }
  onReaction(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('reaction', (reaction: any) => {
        Observer.next(reaction);
      });
    });
  }
  statusChange(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('statusChange', (user: any) => {
        Observer.next(user);
      });
    });
  }
  upgardingToAdmin(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('upgardingToAdmin', (conv: any) => {
        //set the new conv
        this.setThisConv(conv);
        Observer.next(conv);
      });
    });
  }
  upgardingToChef(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('upgardingToChef', (conv: any) => {
        //set the new conv
        this.setThisConv(conv);
        Observer.next(conv);
      });
    });
  }
  downgardingToAdmin(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('downgardingAdmin', (conv: any) => {
        //set the new conv

        this.setThisConv(conv);
        Observer.next(conv);
      });
    });
  }
  convChanged(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('convChanged', (conv: any) => {
        Observer.next(conv);
      });
    });
  }
  onRemoveFriend(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on(
        'onRemoveFriend',
        (obj: { remover: string; removed: string }) => {
          //set local storage
          if (this.sessionService.getThisUser()._id == obj.remover) {
            this.sessionService.removeFriend(obj.removed);
          }
          if (this.sessionService.getThisUser()._id == obj.removed) {
            this.sessionService.removeFriend(obj.remover);
          }
          Observer.next(obj);
        }
      );
    });
  }
}
