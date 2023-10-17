import { Component } from '@angular/core';
import { ConvService } from 'src/app/Services/conv.service';
import { UserService } from 'src/app/Services/user.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-header-conv',
  templateUrl: './header-conv.component.html',
  styleUrls: ['./header-conv.component.css'],
})
export class HeaderConvComponent {
  typing: boolean = false;
  typer: any;
  name: string = '';
  photo: string = '';
  lastConnection: any;
  status: string = '';
  me: any = JSON.parse(localStorage.getItem('user') || '{}');
  constructor(
    private convService: ConvService,
    private webSocketService: WebSocketService
  ) {
    //subscribe to typing event
    this.webSocketService.typing().subscribe((object: any) => {
      //object: {idConv: string, user: any}
      if (
        object.idConv == this.getThisConv()._id &&
        object.user._id != this.me._id
      ) {
        this.typing = true;
        this.typer = object.user;
      }
    });
    setInterval(() => {
      this.typing = false;
    }, 3000);
    //subscribe to change the conversation event
    this.convService.getConvChanged().subscribe((conv: any) => {
      this.setThisConv(conv);
      this.fillInfo();
    });
    //first filling
    this.fillInfo();
    this.convService.getConvChanged().subscribe((conv: any) => {
      this.setThisConv(conv);
      this.fillInfo();
    });
  }
  getThisConv() {
    let conv = this.convService.setNameAndPhoto(
      JSON.parse(localStorage.getItem('conv') || '{}')
    );
    return conv;
  }
  setThisConv(conv: any) {
    localStorage.setItem('conv', JSON.stringify(conv));
  }

  fillInfo() {
    this.name = this.getThisConv().name;
    this.photo = this.getThisConv().photo;
    if (this.getThisConv().members.length == 2) {
      let otherUser: any = this.getThisConv().members.filter((member: any) => {
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
      this.lastConnection = 'Groupe';
    }
  }
  getStatusClasses() {
    return this.convService.getStatusClassesForConv(this.getThisConv());
  }
}
