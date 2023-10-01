import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';
import { env } from 'src/env';
import { Message } from '../Interfaces/message.interface';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  transferMessegeSent: any = new Subject<any>();
  transferMessegeResponse: any = new Subject<any>();
  searchKey: any = new Subject<any>();

  uri = env.api_url;
  constructor(private http: HttpClient, private socket: Socket) {}
  findMessageOfConv(limit: number, idConv: string) {
    return this.http.get(`${this.uri}/message/ofConv/${idConv}/${limit}`);
  }
  send(message: any) {
    message.conv = JSON.parse(localStorage.getItem('conv') || '{}')._id;
    console.log(message);

    return this.http.post(`${this.uri}/message`, message);
  }
  newMessage(): Observable<Message> {
    return new Observable<Message>((Observer) => {
      this.socket.on('newMessage', (message: Message) => {
        //ignoring my messages
        if (
          message.sender._id !=
          JSON.parse(localStorage.getItem('user') || '{}')._id
        ) {
          Observer.next(message);
          console.log(message);
        }
      });
    });
  }

  getMessageSent() {
    return this.transferMessegeSent.asObservable();
  }
  setMessageSent(msg: any) {
    this.transferMessegeSent.next(msg);
  }
  getMessageResponse() {
    return this.transferMessegeResponse.asObservable();
  }
  setMessageResponse(msg: any) {
    this.transferMessegeResponse.next(msg);
  }
  getSearchKey() {
    return this.searchKey.asObservable();
  }
  setSearchKey(key: any) {
    this.searchKey.next(key);
    if (key == '') {
      localStorage.removeItem('keySearchMessages');
    } else {
      localStorage.setItem('keySearchMessages', key);
    }
  }
  getMessagesByKey(key: string) {
    return this.http.get(`${this.uri}/message/search/${key}`);
  }
}
