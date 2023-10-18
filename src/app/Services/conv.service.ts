import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  getThisConv() {
    return JSON.parse(localStorage.getItem('conv') || '{}');
  }
  getConvsByKey(key: string) {
    return this.Http.get(
      `${this.uri}/conv/search/${key}/${this.getThisUser()._id}`
    );
  }
  getConvsSearched(key: string) {
    return this.Http.get(
      `${this.uri}/conv/search/${key}/${this.getThisUser()._id}`
    );
  }
  //create a private conversation
  createConv(friend1: any) {
    const conv: any = {
      type: 'private',
      members: [friend1, this.getThisUser()._id],
      createdAt: new Date(),
    };
    return this.Http.post(`${this.uri}/conv`, conv);
  }
  getConvs() {
    return this.Http.get(`${this.uri}/conv/myConvs/${this.getThisUser()._id}`);
  }
  getConv(idConv: string) {
    return this.Http.get(`${this.uri}/conv/${idConv}`);
  }
  leaveConv() {
    return this.Http.delete(
      `${this.uri}/conv/leave/${this.getThisUser()._id}/${
        this.getThisConv()._id
      }`
    );
  }
  getMembers() {
    return this.Http.get(
      `${this.uri}/conv/members/${this.getThisConv()._id}/${
        this.getThisUser()._id
      }`
    );
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
    for (let member of members) {
      if (member._id != this.getThisUser()._id && member.status == 'online') {
        return {
          status: true,
          ' online': true,
        };
      }
    }
    return {
      status: true,
      ' offline': true,
    };
  }
  update(conv: any) {
    return this.Http.patch(`${this.uri}/conv/${this.getThisConv()._id}`, conv);
  }
  updatePhoto(file: any) {
    let dataForm = new FormData();
    dataForm.append('file', file);
    return this.Http.patch(
      `${this.uri}/conv/photo/${this.getThisConv()._id}`,
      dataForm
    );
  }
  getEmoji() {
    switch (this.getThisConv().theme) {
      case 'basic':
        return '👍';
        break;
      case 'love':
        return '❤️';
        break;
      case 'spring':
        return '🌸';
        break;
      case 'panda':
        return '🐼';
        break;

      default:
        return '👍';

        break;
    }
  }
  setTheme() {
    let theme = this.getThisConv().theme;
    let doc = document.documentElement;
    let convContainer = document.getElementById('convContainer') as HTMLElement;
    if (theme == undefined) {
      theme = 'basic';
    }

    switch (theme) {
      case 'basic':
        if (convContainer) {
          convContainer.style.backgroundColor = 'var(--bg-body-color)';
        }
        doc.style.setProperty('--bg-color-conv', 'var(--bg-color)');
        doc.style.setProperty('--font-color-conv', 'var(--font-color)');
        doc.style.setProperty('--third-color-conv', 'var(--third-color)');
        doc.style.setProperty('--shadow-color-conv', 'var(--shadow-color)');
        break;
      case 'love':
        if (convContainer) {
          convContainer.style.backgroundColor = 'rgba(255, 0, 0,0.3)';
        }
        doc.style.setProperty('--bg-color-conv', 'rgb(255, 105, 180)');
        doc.style.setProperty('--font-color-conv', 'white');
        doc.style.setProperty('--third-color-conv', 'black');
        doc.style.setProperty(
          '--shadow-color-conv',
          'rgba(124, 121, 189, 0.5)'
        );

        break;
      case 'spring':
        if (convContainer) {
          convContainer.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
        }
        doc.style.setProperty('--bg-color-conv', 'green');
        doc.style.setProperty('--font-color-conv', 'white');
        doc.style.setProperty('--third-color-conv', 'black');
        doc.style.setProperty(
          '--shadow-color-conv',
          'rgba(124, 121, 189, 0.5)'
        );

        break;
      case 'panda':
        if (convContainer) {
          convContainer.style.backgroundColor = 'black';
        }
        doc.style.setProperty('--bg-color-conv', 'black');
        doc.style.setProperty('--font-color-conv', 'white');
        doc.style.setProperty('--third-color-conv', 'gray');
        doc.style.setProperty(
          '--shadow-color-conv',
          'rgba(124, 121, 189, 0.5)'
        );

        break;

      default:
        break;
    }
  }
  typing() {
    return this.Http.post(`${this.uri}/conv/typing`, {
      idConv: this.getThisConv()._id,
      user: this.getThisUser(),
    });
  }
  removeFromGroupe(idUser: string) {
    return this.Http.delete(
      `${this.uri}/conv/removeFromGroupe/${idUser}/${this.getThisUser()._id}/${
        this.getThisConv()._id
      }`
    );
  }
  addMembers(members: any) {
    return this.Http.patch(
      `${this.uri}/conv/addMembers/${this.getThisConv()._id}`,

      members
    );
  }
  getOtherMember(conv: any) {
    if (conv.members.length != 2) return conv;
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    if (conv.members.length == 1) return conv.members[0];
    if (conv.members[0]._id == user._id) {
      return conv.members[1];
    } else {
      return conv.members[0];
    }
  }
  setNameAndPhoto(conv: any) {
    //if groupe reutrn
    if (conv.type == 'groupe') return conv;
    const me = this.getThisUser();
    let friend = this.getOtherMember(conv);
    if (conv.members.length == 1) {
      conv.name = me.firstName + ' ' + me.lastName;
      conv.photo = me.photo;
    }
    if (conv.members.length == 2) {
      if ((conv.members.length = 2)) {
        if (conv.members[0]._id == me._id) {
          if (friend != null) {
            conv.name = friend.firstName + ' ' + friend.lastName;
            conv.photo = friend.photo;
          } else {
            conv.name = me.firstName + ' ' + me.lastName;
            conv.photo = me.photo;
          }
        } else {
          if (friend != null) {
            conv.name = friend.firstName + ' ' + friend.lastName;
            conv.photo = friend.photo;
          } else {
            conv.photo = me.photo;
            conv.name = me.firstName + ' ' + me.lastName;
          }
        }
      }
    }

    return conv;
  }
}
