import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';
// import {  WebSocketSubject } from 'rxjs/webSocket';

import { Message } from '../Interfaces/message.interface';
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  transferMessegeSent: any = new Subject<any>();
  transferMessegeResponse: any = new Subject<any>();
  searchKey: any = new Subject<any>();
  constructor(
    private socket: Socket // private websocketSubject: WebSocketSubject<any>
  ) {}
  setThisConv(conv: any) {
    localStorage.setItem('conv', JSON.stringify(conv));
  }
  newMessage(): Observable<Message> {
    return new Observable<Message>((Observer) => {
      this.socket.on('newMessage', (message: Message) => {
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
        Observer.next(object);
      });
    });
  }
  onCancelFriend(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('cancelFriend', (object: any) => {
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
      this.socket.on('upgardingToAdmin', (bodyReq: any) => {
        //set the new conv
        console.log(bodyReq);
        this.setThisConv(bodyReq.conv);
        Observer.next(bodyReq);
      });
    });
  }
  downgardingToAdmin(): Observable<any> {
    return new Observable<any>((Observer) => {
      this.socket.on('downgardingAdmin', (bodyReq: any) => {
        //set the new conv
        console.log(bodyReq);

        this.setThisConv(bodyReq.conv);
        Observer.next(bodyReq);
      });
    });
  }
}
