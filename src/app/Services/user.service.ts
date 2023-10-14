import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from '../../env';
import { Observable, Subject } from 'rxjs';
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

  constructor(private http: HttpClient) {}

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
  getUsersSearched(key: string) {
    let user: string | null = localStorage.getItem('user');
    let myid;
    if (user != null) {
      myid = JSON.parse(user)._id;
    }
    let users = this.http.get(`${this.uri}/user/search/${key}/${myid}`);
    return users;
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
      status: true,
      ' online': user.status == 'online',
      ' busy': user.status == 'busy',
      ' away': user.status == 'away',
      ' offline': user.status == 'offline',
    };
  }
  setTheme() {
    let theme = JSON.parse(localStorage.getItem('user') || '{}').theme;
    let doc = document.documentElement;
    let adminContainer = document.getElementById(
      'adminContainer'
    ) as HTMLElement;
    if (theme == undefined) {
      theme = 'basic';
    }
    switch (theme) {
      case 'basic':
        adminContainer.style.backgroundColor = 'var(--bg-body-color)';
        // doc.style.setProperty('--bg-color-admin', 'var(--bg-color)');
        // doc.style.setProperty('--font-color-admin', 'var(--font-color)');
        // doc.style.setProperty('--third-color-admin', 'var(--third-color)');
        // doc.style.setProperty('--shadow-color-admin', 'var(--shadow-color)');

        break;
      case 'love':
        adminContainer.style.backgroundColor = 'rgba(255, 105, 180,0.3)';
        doc.style.setProperty('--bg-color-admin', 'rgb(255, 105, 180)');
        doc.style.setProperty('--font-color-admin', 'white');
        doc.style.setProperty('--third-color-admin', 'black');
        doc.style.setProperty(
          '--shadow-color-admin',
          'rgba(124, 121, 189, 0.5)'
        );

        break;
      case 'spring':
        adminContainer.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
        doc.style.setProperty('--bg-color-admin', 'green');
        doc.style.setProperty('--font-color-admin', 'white');
        doc.style.setProperty('--third-color-admin', 'black');
        doc.style.setProperty(
          '--shadow-color-admin',
          'rgba(124, 121, 189, 0.5)'
        );

        break;
      case 'panda':
        adminContainer.style.backgroundColor = 'black';
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
}
