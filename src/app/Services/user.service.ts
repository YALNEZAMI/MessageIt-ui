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
  getPhoto2(photo: string) {
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

  getStatusClassesForUser(user: any) {
    return {
      status: true,
      ' online': user.status == 'online',
      ' busy': user.status == 'busy',
      ' away': user.status == 'away',
      ' offline': user.status == 'offline',
    };
  }
}
