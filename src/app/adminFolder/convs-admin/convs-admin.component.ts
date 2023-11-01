import { Component, OnInit } from '@angular/core';
import { ConvService } from 'src/app/Services/conv.service';
import { Conv } from '../../Interfaces/conv.interface';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/Services/webSocket.service';
import { SessionService } from 'src/app/Services/session.service';
import { MessageService } from 'src/app/Services/message.service';

@Component({
  selector: 'app-convs-admin',
  templateUrl: './convs-admin.component.html',
  styleUrls: ['./convs-admin.component.css'],
})
export class ConvsAdminComponent implements OnInit {
  private convs: Conv[] = [];
  done = false;
  constructor(
    private convService: ConvService,
    private router: Router,
    private webSocketService: WebSocketService,
    private sessionService: SessionService,
    private messageService: MessageService
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
  getThisConvs() {
    for (let i = 0; i < this.convs.length; i++) {
      const conv = this.convs[i];
      if (conv.members.length == 2) {
        this.convs[i] = this.convService.setNameAndPhoto(conv);
      }
    }
    return this.convs;
  }

  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
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
        if (conv._id == msg.conv) {
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
          //resort the convs
          this.setAtTop(conv._id);
        }
      });
    });
  }
  lastMsgIsSeen(conv: any) {
    let lastMsg = conv.lastMessage;
    if (lastMsg != null && lastMsg != undefined) {
      return lastMsg.vus.includes(this.getThisUser()._id);
    } else {
      return false;
    }
  }
  getLastMessageHour(conv: Conv) {
    if (conv.lastMessage != null) {
      let date = new Date(conv.lastMessage.date);
      let hour = date.getHours();
      if (hour < 10) hour = Number('0' + hour);
      let minutes = date.getMinutes();
      if (minutes < 10) minutes = Number('0' + minutes);
      return hour + ':' + minutes;
    } else {
      return '';
    }
  }
  getLastMessageText(conv: Conv) {
    if (conv.lastMessage != null) {
      if (conv.lastMessage.typeMsg == 'notif') {
        return this.messageService.getNotifText(conv.lastMessage);
      }
      if (conv.lastMessage.text == '') {
        conv.lastMessage.text = 'files';
      }
      if (conv.lastMessage.text.length < 20) return conv.lastMessage.text;
      return conv.lastMessage.text.slice(0, 20) + '...';
    } else {
      return '';
    }
  }
  toLocalString(dateString: any) {
    let date = new Date(dateString);
    return date.toLocaleString();
  }

  async goToConv(conv: Conv) {
    this.sessionService.setThisConv(conv);
    this.router.navigate(['/conv/messages']);
  }
  options(conv: Conv) {
    this.sessionService.setThisConv(conv);
    this.router.navigate(['/conv/settings']);
  }

  getStatusClasses(conv: any) {
    return this.convService.getStatusClassesForConv(conv);
  }
  getLastMsgSender(conv: any) {
    if (conv.lastMessage != null) {
      if (conv.lastMessage.typeMsg == 'notif') {
        return conv.lastMessage.maker;
      }
      if (conv.lastMessage.sender._id == this.getThisUser()._id) {
        conv.lastMessage.sender.firstName = 'you';
        conv.lastMessage.sender.lastName = '';
        return conv.lastMessage.sender;
      } else {
        return conv.lastMessage.sender;
      }
    } else {
      return '';
    }
  }
  getOtherMember(conv: any) {
    return this.convService.getOtherMember(conv);
  }
  getOtherMemberStatus(conv: any) {
    //lonley case
    if (conv.members.length == 1) {
      return 'online';
    }
    //groupe case
    if (conv.members.length > 2) {
      conv.members.map((member: any) => {
        if (member._id != this.getThisUser()._id && member.status == 'online') {
          return member.status;
        }
      });
      return 'offline';
    }
    //private case
    let otherMember = this.getOtherMember(conv);
    return otherMember.status;
  }
  noConvs() {
    return this.convs.length == 0;
  }
}
