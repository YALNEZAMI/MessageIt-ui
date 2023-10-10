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
    localStorage.setItem('conv', JSON.stringify(conv));
    //set theme
    this.setTheme();
    this.changeConv.next(conv);
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
  getEmoji() {
    let conv = JSON.parse(localStorage.getItem('conv') || '{}');
    switch (conv.theme) {
      case 'basic':
        return '👍';
        break;
      case 'love':
        return '❤️';
        break;
      case 'spring':
        return '🌸';
        break;

      default:
        return '👍';

        break;
    }
  }
  setTheme() {
    let theme = JSON.parse(localStorage.getItem('conv') || '{}').theme;
    let doc = document.documentElement;
    let convContainer = document.getElementById('convContainer') as HTMLElement;
    if (theme == undefined) {
      theme = 'basic';
    }
    switch (theme) {
      case 'basic':
        convContainer.style.backgroundColor = 'var(--bg-body-color)';
        doc.style.setProperty('--bg-color-conv', 'var(--bg-color)');
        doc.style.setProperty('--font-color-conv', 'var(--font-color)');
        doc.style.setProperty('--third-color-conv', 'var(--third-color)');
        doc.style.setProperty('--shadow-color-conv', 'var(--shadow-color)');
        break;
      case 'love':
        convContainer.style.backgroundColor = 'rgba(255, 0, 0,0.3)';
        doc.style.setProperty('--bg-color-conv', 'rgb(255, 105, 180)');
        doc.style.setProperty('--font-color-conv', 'white');
        doc.style.setProperty('--third-color-conv', 'black');
        doc.style.setProperty(
          '--shadow-color-conv',
          'rgba(124, 121, 189, 0.5)'
        );

        break;
      case 'spring':
        convContainer.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';

        doc.style.setProperty('--bg-color-conv', 'green');
        doc.style.setProperty('--font-color-conv', 'white');
        doc.style.setProperty('--third-color-conv', 'black');
        doc.style.setProperty(
          '--shadow-color-conv',
          'rgba(124, 121, 189, 0.5)'
        );

        break;

      default:
        break;
    }
  }
}
