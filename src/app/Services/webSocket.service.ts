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
        (object: { idUser: string; idConv: string }) => {
          Observer.next(object);
        }
      );
    });
  }
}
