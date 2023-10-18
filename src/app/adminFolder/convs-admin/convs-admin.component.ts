import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ConvService } from 'src/app/Services/conv.service';
import { Conv } from '../../Interfaces/conv.interface';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-convs-admin',
  templateUrl: './convs-admin.component.html',
  styleUrls: ['./convs-admin.component.css'],
})
export class ConvsAdminComponent implements OnInit {
  private convs: Conv[] = [];
  done = false;
  noRes = false;
  @ViewChild('lastMessage') lastMessage: ElementRef = new ElementRef('');
  constructor(
    private convService: ConvService,
    private router: Router,
    private webSocketService: WebSocketService
  ) {
    //subscribe to add member to groupe event
    this.webSocketService
      .onAddMemberToGroupe()
      .subscribe((convAndNewMembers: any) => {
        console.log('members', convAndNewMembers.members);
        console.log('myid', this.getThisUser()._id);
        console.log();

        let conv = convAndNewMembers.conv;
        let newMembers = convAndNewMembers.members;
        if (newMembers.includes(this.getThisUser()._id)) {
          this.convs.unshift(conv);
          this.noRes = false;
        }
      });
    //subscribe to new convs
    this.webSocketService.onCreateConv().subscribe((conv: any) => {
      for (let member of conv.members) {
        if (member._id == this.getThisUser()._id) {
          this.convs.unshift(conv);
          this.noRes = false;
        }
      }
    });
    this.convService.getConvs().subscribe(async (data: any) => {
      this.convs = await data;
      if (this.convs.length == 0) {
        this.noRes = true;
      } else {
        this.noRes = false;
      }
      this.done = true;
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
    return lastMsg.vus.includes(this.getThisUser()._id);
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
    localStorage.setItem('conv', JSON.stringify(conv));
    this.router.navigate(['/conv/messages']);
  }
  options(conv: Conv) {
    localStorage.setItem('conv', JSON.stringify(conv));
    this.router.navigate(['/conv/settings']);
  }

  getStatusClasses(conv: any) {
    if (conv.name == 'n') {
      this.convService.getStatusClassesForConv(conv);
    }
    return this.convService.getStatusClassesForConv(conv);
  }
  getLastMsgSender(conv: any) {
    if (conv.lastMessage != null) {
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
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    if (conv.members.length == 1) return conv.members[0];
    if (conv.members[0]._id == user._id) {
      return conv.members[1];
    } else {
      return conv.members[0];
    }
  }
  getOtherMemberStatus(conv: any) {
    if (conv.members.length == 1) {
      return 'online';
    }
    let otherMember = this.getOtherMember(conv);
    return otherMember.status;
  }
}
