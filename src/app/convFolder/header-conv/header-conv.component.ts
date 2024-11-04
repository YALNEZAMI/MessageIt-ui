import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConvService } from 'src/app/Services/conv.service';
import { SessionService } from 'src/app/Services/session.service';
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
    private webSocketService: WebSocketService,
    private sessionService: SessionService,
    private userService: UserService,
    private route: ActivatedRoute
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
    //statusChange websocket subscription
    this.webSocketService.statusChange().subscribe((user: any) => {
      const idConv = route.snapshot.queryParamMap.get('conv_id');
      if (idConv) {
        this.convService.getConv(idConv).subscribe((c: any) => {
          c.members.map((member: any) => {
            if (member._id == user._id) {
              this.status = user.status;
            }
          });
        });
      } else {
        this.convService.getThisConv().members.map((member: any) => {
          if (member._id == user._id) {
            this.status = user.status;
          }
        });
      }
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
  isGroupe() {
    return this.getThisConv().type == 'groupe';
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
    } else if (this.getThisConv().members.length == 1) {
      this.status = 'online';
      this.lastConnection = 'Your lonley self';
    } else {
      this.lastConnection = 'Groupe';
    }
  }
  getStatusClasses() {
    return this.convService.getStatusClassesForConv(this.getThisConv());
  }
  getTailwindClasses(level: number, justBg: boolean) {
    return this.userService.getTailwindThemeClasses(
      this.convService.getThisConv().theme,
      level,
      justBg
    );
  }
}
