import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ConvService } from 'src/app/Services/conv.service';
import { MessageService } from 'src/app/Services/message.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnDestroy {
  photoDisplayedUrl: string = '';
  messageClicked: string = '';
  isBottom: boolean = true;
  loading: boolean = false;
  noMoreUp = false;
  noMoreDown = true;
  ref: boolean = false;
  done: boolean = false;
  lastMsg: any;
  firstMsg: any;
  msgToDelete: any;
  //msg to reply to
  rep: any;
  @ViewChild('chatContainer') chatContainer: ElementRef = new ElementRef('');
  conv: any = JSON.parse(localStorage.getItem('conv') || '{}');
  me = JSON.parse(localStorage.getItem('user') || '{}');
  MoreMessages: boolean = true;

  private messages: any[] = [];
  constructor(
    private messageService: MessageService,
    private convService: ConvService,
    private webSocektService: WebSocketService
  ) {
    //initial set vus
    this.messageService.setVus().subscribe((res: any) => {});
    //subscribe to change the conversation event
    this.convService.getConvChanged().subscribe((conv: any) => {
      localStorage.removeItem('rangeMessageSearched');
      localStorage.removeItem('idMessage');
      localStorage.setItem('conv', JSON.stringify(conv));
      this.conv._id = conv._id;
      this.loading = false;
      this.done = false;
      this.messages = [];
      this.messageService.findMessageOfConv(conv._id).subscribe((msgs: any) => {
        this.messages = msgs;
        setTimeout(() => {
          this.scrollDown();
          this.done = true;
        }, 100);
      });
    });
    //if search get seared message and its env else get first 20  messages
    if (localStorage.getItem('idMessage')) {
      this.noMoreDown = false;
      let idMsg = localStorage.getItem('idMessage') || '';

      this.messageService
        .findSearchedMessagePortion(this.conv._id, idMsg)
        .subscribe(async (data: any) => {
          //set global messages and properties
          this.messages = [];
          this.messages = await data;

          setTimeout(() => {
            this.goToMessage(localStorage.getItem('idMessage') || '');
          }, 10);
          this.done = true;
          //reinit the idMessage
          localStorage.removeItem('idMessage');
        });
    } else {
      //get initial messages without search
      this.messageService
        .findMessageOfConv(this.conv._id)
        .subscribe(async (msgs: any) => {
          //set global messages and properties
          this.messages = await msgs;

          this.done = true;
          //set viewrs photos
          this.setPhotosOfViewers();

          //scroll down
          setTimeout(() => {
            this.scrollDown();
          }, 100);
        });
    }

    //websocket subscribe for new message
    this.webSocektService.newMessage().subscribe(async (message: any) => {
      let realMessage = await message;
      let idConv = realMessage.conv;

      if (idConv == this.conv._id) {
        this.messages.push(realMessage);
        // set new message like vus
        this.messageService.setVus().subscribe((res: any) => {
          //set viewrs photos
          this.setPhotosOfViewers();
        });
        //scroll down
        let timeToWait = 50;
        if (realMessage.files.length > 0) {
          timeToWait *= realMessage.files.length;
        }
        if (this.isBottom) {
          setTimeout(() => {
            this.scrollDown();
          }, timeToWait);
        }
      }
    });
    //websocket setVus
    this.webSocektService.setVus().subscribe(async (data: any) => {
      let realData = await data;
      if (data.idConv == this.conv._id) {
        //update User last message seen
        this.updateViewer(realData.myId);
      }
    });
    //websocket message deleted
    this.webSocektService.messageDeleted().subscribe(async (object: any) => {
      //object:{idMsg:string,idUser:string,memberLength:number,operation:'deleteForMe'||'deleteForAll}
      if (object.operation == 'deleteForAll') {
        this.messages = this.messages.filter((msg) => {
          return msg._id != object.idMsg;
        });
      } else {
        if (object.idUser == this.me._id && object.operation == 'deleteForMe') {
          this.messages = this.messages.filter((msg) => {
            return msg._id != object.idMsg;
          });
        }
      }
    });

    //update bottom
    this.updateBottom();
  }

  // setThisVus(data: any) {}
  ngOnDestroy(): void {}
  displayPhoto(file: string) {
    let cadrePhotoDisplayed = document.getElementById(
      'cadrePhotoDisplayed'
    ) as HTMLElement;
    let photoDisplayed = document.getElementById(
      'photoDisplayed'
    ) as HTMLImageElement;
    if (cadrePhotoDisplayed.style.display == 'block') {
      cadrePhotoDisplayed.style.display = 'none';
      photoDisplayed.src = '';

      return;
    }
    cadrePhotoDisplayed.style.display = 'block';
    photoDisplayed.src = file;
  }
  setMessageClicked(id: string) {
    if (this.messageClicked == id) {
      this.messageClicked = '';
    } else {
      this.messageClicked = id;
    }
  }
  scrollDown() {
    setTimeout(() => {
      let height = this.chatContainer.nativeElement.scrollHeight;
      let chatContainer = this.chatContainer.nativeElement;
      chatContainer.scrollTo(0, height);
      this.updateBottom();
    }, 10);
  }
  scrollDownSmooth() {
    let height = this.chatContainer.nativeElement.scrollHeight;
    let chatContainer = this.chatContainer.nativeElement;
    chatContainer.scrollTo({
      top: height,
      left: 0,
      behavior: 'smooth',
    });
  }
  scrollById(id: string) {
    let element = document.getElementById(id) || document.createElement('div');

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  locateMessage(id: string): string {
    let head = this.messages.slice(0, 3);
    let tail = this.messages.slice(this.messages.length - 3);
    for (let i = 0; i < 3; i++) {
      if (head[i]._id == id) {
        return 'head';
      } else if (tail[i]._id == id) {
        return 'tail';
      }
    }
    return 'body';
  }
  goToMessage(id: string) {
    let msg = document.getElementById(id);
    if (msg != null) {
      msg.style.background = 'var(--shadow-color)';

      setTimeout(() => {
        if (msg) msg.style.background = 'transparent';
      }, 3000);
      //if no more than 5 messages just scroll down
      if (this.messages.length < 5) {
        this.scrollDownSmooth();
        return;
      }
      switch (this.locateMessage(id)) {
        case 'body':
          msg.scrollIntoView({ behavior: 'smooth', block: 'center' });

          break;
        case 'head':
          msg.scrollIntoView({ behavior: 'smooth', block: 'start' });

          break;
        case 'tail':
          msg.scrollIntoView({ behavior: 'smooth', block: 'end' });

          break;

        default:
          break;
      }
    }
  }

  checktop() {
    let scrollingDiv = this.chatContainer.nativeElement;
    if (scrollingDiv.scrollTop <= 0) {
      this.appendUp();
    }
  }

  updateBottom(): void {
    let element = this.chatContainer.nativeElement;
    if (element.scrollHeight - element.scrollTop - 51 <= element.clientHeight) {
      this.isBottom = true;
    } else {
      this.isBottom = false;
    }
  }

  getTypeDateOf(dateString: string) {
    return new Date(dateString);
  }
  getMessages() {
    return this.messages;
  }
  getImgSentContainer(msg: any) {
    let idUser = msg.sender._id;

    return {
      row: true,
      myPhotoSentContainer: idUser == this.me._id,
      otherPhotoSentContainer: idUser != this.me._id,
    };
  }
  getChatClasses(msg: any) {
    let idUser = msg.sender._id;

    let firstRes = {
      emoji: false,
      right: idUser == this.me._id,
      'chat-right': idUser == this.me._id,
      'chat-left': idUser != this.me._id,
    };

    return firstRes;
  }

  textClasses(msg: any) {
    let text = msg.text;
    let emoji = ['👍', '🌸', '❤️', '🐼'];
    let res;
    if (emoji.includes(text)) {
      res = {
        emoji: true,
        'chat-text': false,
      };
    } else {
      res = {
        notEmoji: true,
      };
    }
    return res;
  }
  getInputSecondDivClasses() {
    return {
      'input-second-div': true,
      'input-second-div-focus': this.ref,
    };
  }

  //append 20 messages to the global messages
  //on the top of the page => load 20 messages if it exist
  async appendUp() {
    //checking if there is more result up
    if (this.noMoreUp) return;
    //if the hole conv has less than 20 messages ,return because all messages are loaded
    if (this.messages.length < 20) return;
    //loading=true to display the up spinner
    this.loading = true;
    //getting the message above the upper message
    let fristMsgId = this.messages[0]._id;
    this.messageService
      .appendUp(this.conv._id, fristMsgId)
      .subscribe((msgs: any) => {
        //set noMoreUp to declare avoid make request to get up messages(no result)
        if (msgs.length == 0) {
          this.noMoreUp = true;
        }
        //append the result at the head
        this.messages = msgs.concat(this.messages);
        //loading =false ,to hide the up spinner
        this.loading = false;
      });
  }
  //append messages at bottom,down buttom
  appendDown() {
    // if no more result ath the bottom,just scroll down
    if (this.noMoreDown) {
      this.updateBottom();
      this.scrollDown();
      return;
    }
    if (this.messages.length < 20) {
      this.updateBottom();
      this.scrollDown();
      this.noMoreDown = true;
      return;
    }
    let lastMsgId = this.messages[this.messages.length - 1]._id;

    this.messageService
      .appendDown(this.conv._id, lastMsgId)
      .subscribe((msgs: any) => {
        if (msgs.length < 20) {
          this.noMoreDown = true;
        }
        this.messages = this.messages.concat(msgs);
        setTimeout(() => {
          this.updateBottom();
          this.scrollDown();
        }, 100);
      });
  }
  //convert a date to a usable string
  date(msg: any): string {
    return this.getTypeDateOf(msg.date).toLocaleString();
  }

  //add 0 to a number if it's less than 10=> for the month and the day of the date
  add0(str: number) {
    return str < 10 ? '0' + str : str;
  }
  setPhotosOfViewers() {
    this.messages.map((msg: any) => {
      msg.lastMsgSeenBy = [];
    });
    let res: { member: any; lastMsgSeen: any }[] = [];
    let members = this.conv.members;
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      let msgsSeen = this.messages.filter((msg: any) => {
        return msg.vus.includes(member._id) && member._id != this.me._id;
      });
      if (msgsSeen.length > 0)
        res.push({
          member: member,
          lastMsgSeen: msgsSeen[msgsSeen.length - 1],
        });
    }
    for (let i = 0; i < res.length; i++) {
      const element = res[i];
      let lasMessageSeen = element.lastMsgSeen;
      let index = this.messages.indexOf(lasMessageSeen);
      this.messages[index].lastMsgSeenBy = [];
      this.messages[index].lastMsgSeenBy.push(element.member);
    }
  }
  updateViewer(id: string) {
    if (this.messages.length == 0) return;
    if (this.messages[this.messages.length - 1].lastMsgSeenBy == undefined) {
      this.messages[this.messages.length - 1].lastMsgSeenBy = [];
    }
    this.messages[this.messages.length - 1].vus.push(id);
    this.setPhotosOfViewers();
  }
  canDeleteMsgForAll = false;
  delteOptions(msg: any) {
    if (msg != null && msg.sender._id == this.me._id) {
      this.canDeleteMsgForAll = true;
    }

    let optionPopupCadre = document.getElementById(
      'optionPopupCadre'
    ) as HTMLElement;

    if (optionPopupCadre.style.display == 'block') {
      optionPopupCadre.style.display = 'none';
      this.msgToDelete = null;
    } else {
      this.msgToDelete = msg;
      optionPopupCadre.style.display = 'block';
    }
  }
  deleteMsgForAll() {
    this.messageService
      .deleteMsgForAll(this.msgToDelete)
      .subscribe((res) => {});
  }
  deleteMsgForMe() {
    this.messageService.deleteMsgForMe(this.msgToDelete).subscribe((res) => {});
  }

  //rep
  getRepClasses(msg: any) {
    let idSender = msg.sender._id;
    let myid = this.me._id;
    return {
      bi: true,
      'bi-box-arrow-in-down-left': idSender == myid,
      'bi-box-arrow-in-down-right': idSender != myid,
      rotateTheirRepArrow: idSender != myid,
    };
  }
  getSettingsAndRepClasses(msg: any) {
    let idSender = msg.sender._id;
    let myid = this.me._id;
    return {
      row: true,
      marginRightSettingAndRep: idSender == myid,
      marginLeftSettingAndRep: idSender != myid,
    };
  }
  setRep(msg: any) {
    if (msg.text == '') {
      msg.text = 'files';
    }
    this.messageService.setRep(msg);
  }
  getRepOfMsgsClasses(msg: any) {
    return {
      row: true,
      repRight: msg.sender._id == this.me._id,
      repLeft: msg.sender._id != this.me._id,
    };
  }
}
