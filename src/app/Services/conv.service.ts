import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { env } from 'src/env';

@Injectable({
  providedIn: 'root',
})
export class ConvService {
  uri = env.api_url;
  changeConv: any = new Subject<any>();
  changeInfosConv: any = new Subject<any>();

  constructor(
    private Http: HttpClient // private activatedRoute: ActivatedRoute
  ) {}
  getConvsByKey(key: string) {
    let myid = JSON.parse(localStorage.getItem('user') || '{}')._id;

    return this.Http.get(`${this.uri}/conv/search/${key}/${myid}`);
  }
  getConvsSearched(key: string) {
    let myid: string = '';
    if (localStorage.getItem('user') != null) {
      myid = JSON.parse(localStorage.getItem('user') || '{}')._id;
    }
    return this.Http.get(`${this.uri}/conv/search/${key}/${myid}`);
  }
  createConv(friend1: any) {
    let data = {};
    if (localStorage.getItem('user') != null) {
      data = {
        members: [
          friend1,
          JSON.parse(localStorage.getItem('user') || '{}')._id,
        ],
      };
      // console.log(this.me);
    }
    return this.Http.post(`${this.uri}/conv`, data);
  }
  getConvs() {
    let myid = 'lckdsklncjnkjfnvdn';
    myid = JSON.parse(localStorage.getItem('user') || '{}')._id;

    let convs = this.Http.get(`${this.uri}/conv/myConvs/${myid}`);
    return convs;
  }
  getConv(idConv: string) {
    return this.Http.get(`${this.uri}/conv/${idConv}`);
  }
  leaveConv() {
    let myid = JSON.parse(localStorage.getItem('user') || '{}')._id;
    let convid = JSON.parse(localStorage.getItem('conv') || '{}')._id;
    //:idUser/:idConv
    return this.Http.delete(`${this.uri}/conv/leave/${myid}/${convid}`);
  }
  getMembers() {
    let me = JSON.parse(localStorage.getItem('user') || '{}');
    let idConv = JSON.parse(localStorage.getItem('conv') || '{}')._id;
    return this.Http.get(`${this.uri}/conv/members/${idConv}/${me._id}`);
  }
  getConvChanged() {
    return this.changeConv.asObservable();
  }
  setConvChanged(conv: any) {
    this.changeInfosConv.next(conv);
  }
  getConvInfosChanged() {
    return this.changeConv.asObservable();
  }
  setConvInfosChanged(conv: any) {
    this.changeInfosConv.next(conv);
  }
  getStatusClassesForConv(conv: any) {
    let members = conv.members;
    let myId = JSON.parse(localStorage.getItem('user') || '{}')._id;
    let otherMember = null;
    for (let member of members) {
      if (member._id != myId && member != null) {
        otherMember = member;
        break;
      }
    }
    if (otherMember == null) {
      return {
        status: true,
        // ' online': otherMember.status == 'online',
        // ' busy': otherMember.status == 'busy',
        // ' away': otherMember.status == 'away',
        ' offline': otherMember.status == 'offline',
      };
    }
    return {
      status: true,
      ' online': otherMember.status == 'online',
      ' busy': otherMember.status == 'busy',
      ' away': otherMember.status == 'away',
      ' offline': otherMember.status == 'offline',
    };
  }
  update(conv: any) {
    let idConv = JSON.parse(localStorage.getItem('conv') || '{}')._id;
    return this.Http.patch(`${this.uri}/conv/${idConv}`, conv);
  }
  updatePhoto(file: any) {
    let dataForm = new FormData();
    dataForm.append('file', file);
    let idConv = JSON.parse(localStorage.getItem('conv') || '{}')._id;
    return this.Http.patch(`${this.uri}/conv/photo/${idConv}`, dataForm);
  }
}
