import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Conv } from 'src/app/Interfaces/conv.interface';
import { ConvService } from 'src/app/Services/conv.service';
import { MessageService } from 'src/app/Services/message.service';
import { SessionService } from 'src/app/Services/session.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-conversation',

  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css',
})
export class ConversationComponent {
  @Input() conv: Conv | any;
  done = false;
  @Input() IsOnSide: boolean = false;
  constructor(
    private convService: ConvService,
    private router: Router,
    private webSocketService: WebSocketService,
    private sessionService: SessionService,
    private messageService: MessageService
  ) {
    //retrieve convs
    if (this.sessionService.thereAreConvs()) {
      this.done = true;
    } else {
    }
    //subscribe to recieve message event
    this.webSocketService.onRecievedMessage().subscribe((message: any) => {
      this.conv.lastMessage.recievedBy = message.recievedBy;
    });

    //subscribe to change conv event
    this.webSocketService.someConvChanged().subscribe((conv: any) => {
      this.conv = conv;
    });

    //websocket updating vus
    this.webSocketService.setVus().subscribe(async (data: any) => {
      //data:{myId:string,idConv:string}

      if (this.conv.lastMessage != null) {
        this.conv.lastMessage.vus.push(data.myId);
      }
    });
  }

  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  ngOnInit(): void {
    //set the last message with web socket
    this.webSocketService.onLastMsg().subscribe((msg: any) => {
      this.conv.lastMessage = msg;
      //set last message sender status as online
      this.conv.members.map((member: any) => {
        if (
          member._id == msg.sender._id &&
          member._id != this.getThisUser()._id
        ) {
          member.status = 'online';
        }
      });
    });
  }
  lastMsgIsSeen() {
    let lastMsg = this.conv.lastMessage;
    if (lastMsg != null && lastMsg != undefined) {
      return lastMsg.vus.includes(this.getThisUser()._id);
    } else {
      return false;
    }
  }
  getLastMessageHour(conv: Conv) {
    if (conv.lastMessage != null) {
      let date = new Date(conv.lastMessage.date);
      let hour: any = date.getHours();
      if (hour < 10) hour = '0' + hour;
      let minutes: any = date.getMinutes();
      if (minutes < 10) minutes = '0' + minutes;
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

  getSentConditions(msg: any) {
    let bool = this.messageService.sentConditions(msg);

    return bool;
  }
  recievedConditions(msg: any) {
    return this.messageService.recievedConditions(msg);
  }
  getLastMessageViewvers(conv: any) {
    if (conv.lastMessage == null) return;
    let viewversIds = conv.lastMessage.vus;

    let members = conv.members;

    let result: any[] = [];
    members.map((member: any) => {
      if (viewversIds.includes(member._id)) {
        result.push(member);
      }
      return member;
    });
    //exept me
    result = result.filter((member) => {
      return member._id != this.sessionService.getThisUser()._id;
    });
    return result;
  }

  getShortConvName(name: string) {
    if (name.length > 23) {
      return name.slice(0, 20) + '...';
    } else {
      return name;
    }
  }
}
