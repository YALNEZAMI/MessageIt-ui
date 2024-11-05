import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import env from 'src/env';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Theme } from '../Interfaces/Theme';
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  assword: string;
  __v: any;
}
@Injectable({
  providedIn: 'root',
})
export class UserService {
  uri = env.api_url;
  private subject = new Subject<any>();
  private nameChangedSubject = new Subject<any>();
  constructor(private http: HttpClient, router: Router) {}
  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getKey(): Observable<any> {
    return this.subject.asObservable();
  }
  setKey(key: string) {
    this.subject.next(key);
    if (key == '') {
      localStorage.removeItem('key');
    } else {
      localStorage.setItem('key', key);
    }
  }
  getNameChanged(): Observable<any> {
    return this.nameChangedSubject.asObservable();
  }
  setNameChanged(name: string) {
    this.nameChangedSubject.next(name);
  }
  addUser(user: any) {
    return this.http.post(this.uri + '/user', user);
  }
  login(data: any) {
    let res = this.http.get(
      `${this.uri}/user/login/${data.email}/${data.password}`
    );
    return res;
  }
  setPhotoLinkForHtml(photo: string) {
    if (
      !photo.includes(env.api_url) ||
      photo == env.defaultProfilePhoto ||
      photo == null ||
      photo == undefined ||
      photo == '' ||
      photo == ' '
    ) {
      return env.defaultProfilePhoto;
    } else {
      return env.api_url + '/user/uploads/' + photo;
    }
  }
  getUserById(id: string) {
    return this.http.get(`${this.uri}/user/${id}`);
  }
  getUsersSearched(key: string) {
    let myid = this.getThisUser()._id;
    return this.http.get(`${this.uri}/user/search/${key}/${myid}`);
  }
  uploadConvImg(inputImg: any, id: string) {
    let fd = new FormData();
    fd.append('file', inputImg);

    return this.http.post(`${this.uri}/user/uploadProfilePhoto/${id}`, fd);
  }
  updateInfos(user: any) {
    let userReturned: any = this.http.patch(
      `${this.uri}/user/${user._id}`,
      user
    );

    return userReturned;
  }
  resetPassword(data: any) {
    return this.http.patch(`${this.uri}/user/password/reset`, data);
  }
  delete(user: any) {
    return this.http.delete(`${this.uri}/user/${user._id}`);
  }
  getById(id: string) {
    return this.http.get(`${this.uri}/user/${id}`);
  }
  getStatusClassesForUser(user: any) {
    return {
      ' bg-green-500': user.status == 'online',
      ' busy': user.status == 'busy',
      ' away': user.status == 'away',
      ' bg-gray-500': user.status == 'offline',
    };
  }
  setTheme() {
    let theme = this.getThisUser().theme;

    let doc = document.documentElement;
    let adminContainer = document.getElementById(
      'adminContainer'
    ) as HTMLElement;
    if (theme == undefined) {
      theme = 'basic';
    }
    switch (theme) {
      case 'basic':
        if (adminContainer) {
          adminContainer.style.backgroundColor = 'var(--bg-body-color)';
        }
        doc.style.setProperty('--bg-color-admin', 'var(--bg-color)');
        doc.style.setProperty('--font-color-admin', 'var(--font-color)');
        doc.style.setProperty('--third-color-admin', 'var(--third-color)');
        doc.style.setProperty('--shadow-color-admin', 'var(--shadow-color)');

        break;
      case 'love':
        if (adminContainer) {
          adminContainer.style.backgroundColor = 'rgba(255, 105, 180,0.3)';
        }
        doc.style.setProperty('--bg-color-admin', 'rgb(255, 105, 180)');
        doc.style.setProperty('--font-color-admin', 'white');
        doc.style.setProperty('--third-color-admin', 'black');
        doc.style.setProperty(
          '--shadow-color-admin',
          'rgba(124, 121, 189, 0.5)'
        );

        break;
      case 'spring':
        if (adminContainer) {
          adminContainer.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
        }
        doc.style.setProperty('--bg-color-admin', 'green');
        doc.style.setProperty('--font-color-admin', 'white');
        doc.style.setProperty('--third-color-admin', 'black');
        doc.style.setProperty(
          '--shadow-color-admin',
          'rgba(124, 121, 189, 0.5)'
        );

        break;
      case 'panda':
        if (adminContainer) {
          adminContainer.style.backgroundColor = 'rgb(61, 71, 73)';
        }
        doc.style.setProperty('--bg-color-admin', 'black');
        doc.style.setProperty('--font-color-admin', 'white');
        doc.style.setProperty('--third-color-admin', 'gray');
        doc.style.setProperty(
          '--shadow-color-admin',
          'rgba(124, 121, 189, 0.5)'
        );

        break;

      default:
        break;
    }
  }
  // google() {
  //   return this.http.get(`${this.uri}/auth/google/callback`);
  // }
  findForOtherAuthWays(id: string) {
    return this.http.get(`${this.uri}/user/findForOtherAuthWays/${id}`);
  }

  getTailwindThemeClasses(theme: Theme, level: number, justBG: boolean) {
    if (level == 1) {
      return {
        'text-slate-700': theme == 'basic' && !justBG,
        'bg-slate-300 ': theme == 'basic',
        'bg-pink-300 ': theme == 'love',
        'bg-green-300 ': theme == 'spring',
        'text-white': theme == 'love' || (theme == 'spring' && !justBG),
        'bg-slate-700 ': theme == 'panda',
        'text-slate-200': theme == 'panda' && !justBG,
      };
    } else if (level == 2) {
      return {
        'text-slate-700': theme == 'basic' && !justBG,
        'bg-slate-500 ': theme == 'basic',
        'bg-pink-500 ': theme == 'love',
        'bg-green-500 ': theme == 'spring',
        'text-white': theme == 'love' || (theme == 'spring' && !justBG),
        'bg-slate-600 ': theme == 'panda',
        'text-slate-200': theme == 'panda' && !justBG,
      };
    } else if (level == 3) {
      return {
        'bg-white text-black': theme == 'basic',
        'bg-pink-700 text-white': theme == 'love',
        'bg-green-700 text-white': theme == 'spring',
        'bg-black text-white': theme == 'panda',
      };
    } else {
      return {
        'text-slate-700': theme == 'basic' && !justBG,
        'bg-slate-300 ': theme == 'basic',
        'bg-pink-300 ': theme == 'love',
        'bg-green-300 ': theme == 'spring',
        'text-white': theme == 'love' || (theme == 'spring' && !justBG),
        'bg-slate-700 ': theme == 'panda',
        'text-slate-200': theme == 'panda' && !justBG,
      };
    }
  }
  getThirdCommonColor() {
    return 'bg-gray-600 text-white';
  }
}
