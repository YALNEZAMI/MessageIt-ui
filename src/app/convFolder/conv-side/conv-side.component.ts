import { Component, OnInit } from '@angular/core';
import { ConvService } from 'src/app/Services/conv.service';
import { SessionService } from 'src/app/Services/session.service';
import { UserService } from 'src/app/Services/user.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-conv-side',
  templateUrl: './conv-side.component.html',
  styleUrls: ['./conv-side.component.css'],
})
export class ConvSideComponent implements OnInit {
  noConvSearched: boolean = false;
  done = false;
  key: string = '';
  spinnerSearchConvs: boolean = false;
  private convs: any[] = [];

  constructor(
    private convService: ConvService,
    private webSocketService: WebSocketService,
    private sessionService: SessionService,
    private userService: UserService
  ) {
    //retrieve convs
    if (this.sessionService.thereAreConvs()) {
      this.convs = this.sessionService.getThisConvs();
      this.done = true;
    } else {
      this.convService.getConvs().subscribe(async (data: any) => {
        this.convs = await data;
        //set convs in local storage
        this.sessionService.setThisConvs(this.convs);

        this.done = true;
      });
    }
    //subscribe to remove member from groupe event
    this.webSocketService
      .onRemoveFromGroupe()
      .subscribe((obj: { idUser: string; conv: any }) => {
        //update local storage
        this.convs = this.sessionService.getThisConvs();
      });
    //statusChange websocket subscription
    this.webSocketService.statusChange().subscribe((user: any) => {
      this.convs.map((conv: any) => {
        conv.members.map((member: any) => {
          if (member._id == user._id) {
            member.status = user.status;
          }
        });
      });
    });
    //subscribe to add member to groupe event
    this.webSocketService
      .onAddMemberToGroupe()
      .subscribe((convAndNewMembers: any) => {
        this.convs = this.sessionService.getThisConvs();
      });
    //subscribe to create conv
    this.webSocketService.onCreateConv().subscribe((conv: any) => {
      //set convs in local storage
      this.convs = this.sessionService.getThisConvs();
    });
    //subscribe to leave conv
    this.webSocketService.onLeavingConv().subscribe((conv: any) => {
      //set convs in local storage

      this.convs = this.sessionService.getThisConvs();
    });
  }
  getThisConv() {
    return JSON.parse(localStorage.getItem('conv') || '{}');
  }
  setAtTop(id: string) {
    let convs = this.convs;
    let conv: any = convs.find((conv: any) => conv._id == id);
    convs = convs.filter((conv: any) => conv._id != id);
    convs.unshift(conv);
    this.convs = convs;
  }
  ngOnInit(): void {
    //set the last message with web socket
    this.webSocketService.onLastMsg().subscribe((msg: any) => {
      this.convs.map((conv: any) => {
        if (conv._id == msg.conv && this.getThisConv()._id != msg.conv) {
          conv.lastMessage = msg;
          //set last message sender status as online
          conv.members.map((member: any) => {
            if (
              member._id == msg.sender._id &&
              member._id != this.getThisUser()._id
            ) {
              member.status = 'online';
            }
          });
        }
        //resort the convs
        this.setAtTop(conv._id);
      });
    });
  }
  search() {
    if (this.key == '') {
      this.spinnerSearchConvs = false;
      //get other convs on the side
      this.convService.getConvs().subscribe((data: any) => {
        this.convs = data;
      });
      this.noConvSearched = false;
    } else {
      this.spinnerSearchConvs = true;
      this.convService.getConvsByKey(this.key).subscribe((convs: any) => {
        this.convs = convs;

        this.spinnerSearchConvs = false;
        if (this.convs.length == 0) {
          this.noConvSearched = true;
        }
      });
    }
  }
  getConvSideClasses(conv: any) {
    return {
      'conv-selected':
        conv._id == JSON.parse(localStorage.getItem('conv') || '{}')._id,
    };
  }

  hour(conv: any): string {
    let msg = conv.lastMessage;
    if (msg == null) {
      return '';
    }
    let myid = JSON.parse(localStorage.getItem('user') || '{}')._id;
    let res = '';
    res =
      this.add0(this.getTypeDateOf(msg.date).getHours()) +
      ':' +
      this.add0(this.getTypeDateOf(msg.date).getMinutes());

    return res;
  }
  //add 0 to a number if it's less than 10=> for the month and the day of the date
  add0(str: number) {
    return str < 10 ? '0' + str : str;
  }
  getTypeDateOf(dateString: string) {
    return new Date(dateString);
  }
  //change the conversation
  //empty messages and load the new messages
  goToConv(conv: any) {
    if (conv.lastMessage != null) {
      conv.lastMessage.vus.push(this.getThisUser()._id);
    }
    this.convService.setConvChanged(conv);
  }
  getShortText(conv: any) {
    let lasMessage = conv.lastMessage;
    if (lasMessage == null) {
      return 'new conv';
    }
    let text = lasMessage.text;
    if (text == '') {
      return (text = 'files');
    }
    return text.length > 10 ? text.substring(0, 10) + '...' : text;
  }
  getStatusClasses(conv: any) {
    return this.convService.getStatusClassesForConv(conv);
  }
  lastMsgIsSeen(conv: any) {
    if (conv.lastMessage == null || conv.lastMessage == undefined) {
      return false;
    }
    let lastMsg = conv.lastMessage;
    return lastMsg.vus.includes(this.getThisUser()._id);
  }
  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  getThisConvs() {
    for (let i = 0; i < this.convs.length; i++) {
      const conv = this.convs[i];
      if (conv.members.length == 2) {
        this.convs[i] = this.convService.setNameAndPhoto(conv);
      }
    }
    return this.convs;
  }
  getTailwindClasses(level: number, justBg: boolean) {
    return this.userService.getTailwindThemeClasses(
      this.convService.getThisConv().theme,
      level,
      justBg
    );
  }
}
