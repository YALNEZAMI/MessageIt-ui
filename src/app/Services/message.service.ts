import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { env } from 'src/env';
// import { Message } from '../Interfaces/message.interface';
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  searchKey: any = new Subject<any>();
  repToMsg: any = new Subject<any>();
  uri = env.api_url;
  constructor(private http: HttpClient) {}
  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  getThisConv() {
    return JSON.parse(localStorage.getItem('conv') || '{}');
  }
  findMessageOfConv(idConv: string) {
    return this.http.get(
      `${this.uri}/message/ofConv/${idConv}/${this.getThisUser()._id}`
    );
  }
  send(message: any) {
    message.conv = this.getThisConv();
    //files
    let formData = new FormData();
    for (let i = 0; i <= 10; i++) {
      const file = message.files[i];
      formData.append('files', file);
    }
    formData.append('message', JSON.stringify(message));

    return this.http.post(`${this.uri}/message`, formData);
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
    return this.http.get(
      `${this.uri}/message/search/${key}/${this.getThisConv()._id}/${
        this.getThisUser()._id
      }`
    );
  }
  getRange(idConv: string, idMessage: string) {
    return this.http.get(`${this.uri}/message/range/${idConv}/${idMessage}`);
  }
  appendDown(idConv: string, idMessage: string) {
    return this.http.get(
      `${this.uri}/message/appendDown/${idConv}/${idMessage}/${
        this.getThisUser()._id
      }`
    );
  }
  appendUp(idConv: string, idMessage: string) {
    return this.http.get(
      `${this.uri}/message/appendUp/${idConv}/${idMessage}/${
        this.getThisUser()._id
      }`
    );
  }
  findSearchedMessagePortion(idConv: string, idMessage: string) {
    return this.http.get(
      `${this.uri}/message/MessageSearchedGroup/${idConv}/${idMessage}/${
        this.getThisUser()._id
      }`
    );
  }
  //set conv like seen by me
  setVus() {
    let idConv = this.getThisConv()._id;
    let myId = this.getThisUser()._id;
    return this.http.patch(`${this.uri}/message/set/vus`, { idConv, myId });
  }
  deleteMsgForAll(msg: any) {
    let myId = this.getThisUser()._id;
    return this.http.delete(`${this.uri}/message/${msg._id}/${myId}`);
  }
  deleteMsgForMe(msg: any) {
    let idMsg_idUser_MemberLength = {
      idMsg: msg._id,
      idUser: this.getThisUser()._id,
      memberLength: this.getThisConv().members.length,
    };
    return this.http.patch(
      `${this.uri}/message/delete/ForMe`,
      idMsg_idUser_MemberLength
    );
  }
  setRep(msg: any): void {
    this.repToMsg.next(msg);
  }
  getRep() {
    return this.repToMsg.asObservable();
  }
  getMedias() {
    return this.http.get(
      `${this.uri}/message/medias/${this.getThisConv()._id}/${
        this.getThisUser()._id
      }`
    );
  }
}
