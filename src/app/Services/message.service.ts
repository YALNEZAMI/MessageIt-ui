import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { env } from 'src/env';
// import { Message } from '../Interfaces/message.interface';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  transferMessegeSent: any = new Subject<any>();
  transferMessegeResponse: any = new Subject<any>();
  searchKey: any = new Subject<any>();

  uri = env.api_url;
  constructor(private http: HttpClient) {}
  findMessageOfConv(idConv: string) {
    let idUser = JSON.parse(localStorage.getItem('user') || '{}')._id;
    return this.http.get(`${this.uri}/message/ofConv/${idConv}/${idUser}`);
  }
  send(message: any) {
    message.conv = JSON.parse(localStorage.getItem('conv') || '{}')._id;
    message.vus = [];
    message.vus.push(JSON.parse(localStorage.getItem('user') || '{}')._id);
    return this.http.post(`${this.uri}/message`, message);
  }

  getMessageSent() {
    return this.transferMessegeSent.asObservable();
  }
  setMessageSent(msg: any) {
    this.transferMessegeSent.next(msg);
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
    let userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
    let idConv = JSON.parse(localStorage.getItem('conv') || '{}')._id;
    return this.http.get(
      `${this.uri}/message/search/${key}/${idConv}/${userId}`
    );
  }
  getRange(idConv: string, idMessage: string) {
    return this.http.get(`${this.uri}/message/range/${idConv}/${idMessage}`);
  }
  appendDown(idConv: string, idMessage: string) {
    let userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
    return this.http.get(
      `${this.uri}/message/appendDown/${idConv}/${idMessage}/${userId}`
    );
  }
  appendUp(idConv: string, idMessage: string) {
    let userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
    return this.http.get(
      `${this.uri}/message/appendUp/${idConv}/${idMessage}/${userId}`
    );
  }
  findSearchedMessagePortion(idConv: string, idMessage: string) {
    let userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
    return this.http.get(
      `${this.uri}/message/MessageSearchedGroup/${idConv}/${idMessage}/${userId}`
    );
  }
  setVus() {
    let idConv = JSON.parse(localStorage.getItem('conv') || '{}')._id;
    let myId = JSON.parse(localStorage.getItem('user') || '{}')._id;
    return this.http.patch(`${this.uri}/message/set/vus`, { idConv, myId });
  }
  deleteMsgForAll(msg: any) {
    return this.http.delete(`${this.uri}/message/${msg._id}`);
  }
  deleteMsgForMe(msg: any) {
    let idMsg_idUser_MemberLength = {
      idMsg: msg._id,
      idUser: JSON.parse(localStorage.getItem('user') || '{}')._id,
      memberLength: JSON.parse(localStorage.getItem('conv') || '{}').members
        .length,
    };
    return this.http.patch(
      `${this.uri}/message/delete/ForMe`,
      idMsg_idUser_MemberLength
    );
  }
}
