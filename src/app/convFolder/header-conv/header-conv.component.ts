import { Component } from '@angular/core';
import { ConvService } from 'src/app/Services/conv.service';

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
  constructor(private convService: ConvService) {
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
      let otherUser = this.conv.members.filter((member: any) => {
        return member._id != this.me._id;
      })[0];
      this.status = otherUser.status;
      this.lastConnection = new Date(otherUser.lastConnection);
      if (this.status == 'online') {
        this.lastConnection = this.status;
      } else {
        this.lastConnection = 'Since ' + this.lastConnection.toLocaleString();
      }
    } else {
      this.lastConnection = '';
    }
  }
}
