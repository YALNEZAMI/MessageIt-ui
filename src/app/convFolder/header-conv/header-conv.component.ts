import { Component } from '@angular/core';
import { ConvService } from 'src/app/Services/conv.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-header-conv',
  templateUrl: './header-conv.component.html',
  styleUrls: ['./header-conv.component.css'],
})
export class HeaderConvComponent {
  name: string = '';
  photo: string = '';
  lastConnection: any;
  status: string = '';
  me: any;
  conv = JSON.parse(localStorage.getItem('conv') || '{}');
  constructor(
    private convService: ConvService,
    private userService: UserService
  ) {
    this.me = JSON.parse(localStorage.getItem('user') || '{}');
    //subscribe to change the conversation event
    this.convService.getConvChanged().subscribe((conv: any) => {
      this.conv = conv;
      this.fillInfo();
    });
    //first filling
    this.fillInfo();
    this.convService.getConvChanged().subscribe((conv: any) => {
      this.conv = conv;
      this.fillInfo();
    });
  }

  fillInfo() {
    this.name = this.conv.name;
    this.photo = this.conv.photo;
    if (this.conv.members.length == 2) {
      let otherUser: any =
        //  {};
        // this.userService
        //   .getById(
        this.conv.members.filter((member: any) => {
          return member._id != this.me._id;
        })[0];
      // )
      // .subscribe((user: any) => {
      //   otherUser = user;
      // });
      this.status = otherUser.status;

      this.lastConnection = new Date(otherUser.lastConnection);
      if (this.status == 'online') {
        this.lastConnection = this.status;
      } else {
        this.lastConnection = 'Since ' + this.lastConnection.toLocaleString();
      }
    } else {
      this.lastConnection = 'Groupe';
    }
  }
  getStatusClasses() {
    return {
      online: this.status == 'online',
      offline: this.status != 'online',
    };
  }
}
