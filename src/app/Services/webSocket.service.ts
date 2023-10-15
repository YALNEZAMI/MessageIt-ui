import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';
import { env } from 'src/env';
import { Message } from '../Interfaces/message.interface';
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  transferMessegeSent: any = new Subject<any>();
  transferMessegeResponse: any = new Subject<any>();
  searchKey: any = new Subject<any>();
  uri = env.api_url;
  constructor(private socket: Socket) {}

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
}
