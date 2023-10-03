import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ConvService } from 'src/app/Services/conv.service';
import { MessageService } from 'src/app/Services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent implements OnDestroy {
  messageClicked: string = '';
  isBottom: boolean = true;
  loading: boolean = false;
  noMoreUp = false;
  noMoreDown = true;
  ref: boolean = false;
  done: boolean = false;
  @ViewChild('chatContainer') chatContainer: ElementRef = new ElementRef('');
  idConv: string = JSON.parse(localStorage.getItem('conv') || '{}')._id;
  me = JSON.parse(localStorage.getItem('user') || '{}');
  MoreMessages: boolean = true;

  private messages: any[] = [];
  constructor(
    private messageService: MessageService,
    private convService: ConvService
  ) {
    //initial set vus
    this.messageService.setVus().subscribe((res: any) => {});
    //subscribe to change the conversation event
    this.convService.getConvChanged().subscribe((conv: any) => {
      localStorage.removeItem('rangeMessageSearched');
      localStorage.removeItem('idMessage');
      localStorage.setItem('conv', JSON.stringify(conv));
      this.idConv = conv._id;
      this.loading = false;
      this.done = false;
      this.messages = [];
      this.messageService.findMessageOfConv(conv._id).subscribe((msgs: any) => {
        this.messages = msgs;
        setTimeout(() => {
          this.scrollDown();
          this.done = true;
        }, 10);
      });
    });
    //if search get seared message and its env else get first 20  messages
    if (localStorage.getItem('idMessage')) {
      this.noMoreDown = false;
      let idMsg = localStorage.getItem('idMessage') || '';
      this.messageService
        .findSearchedMessagePortion(this.idConv, idMsg)
        .subscribe(async (data: any) => {
          //set global messages and properties
          this.messages = [];
          this.messages = await data;
          setTimeout(() => {
            this.goToMessage(localStorage.getItem('idMessage') || '');
          }, 10);
          this.done = true;
        });
    } else {
      console.log('test');

      //get initial messages without search
      this.messageService
        .findMessageOfConv(this.idConv)
        .subscribe(async (msgs: any) => {
          //set global messages and properties
          this.messages = await msgs;
          this.done = true;
          //scroll down
          setTimeout(() => {
            this.scrollDown();
          }, 10);
        });
    }
    //websocket subscribe
    this.messageService.newMessage().subscribe(async (message: any) => {
      let realMessage = await message;
      this.messages.push(realMessage);
      // set new message like vus
      this.messageService.setVus().subscribe((res: any) => {});
      //scroll down
      if (this.isBottom) {
        setTimeout(() => {
          this.scrollDown();
        }, 5);
      } //set the last message
    });

    //update bottom
    this.updateBottom();
  }
  ngOnDestroy(): void {
    localStorage.removeItem('idMessage');
  }
  setMessageClicked(id: string) {
    if (this.messageClicked == id) {
      this.messageClicked = '';
    } else {
      this.messageClicked = id;
    }
  }
  scrollDown() {
    let height = this.chatContainer.nativeElement.scrollHeight;
    let chatContainer = this.chatContainer.nativeElement;
    chatContainer.scrollTo(0, height);
    this.updateBottom();
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
      msg.style.borderBottom = '1px solid red';
      setTimeout(() => {
        if (msg) msg.style.borderBottom = '0px solid red';
      }, 3000);
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

    let emoji = ['👍', '⭐'];
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
      .appendUp(this.idConv, fristMsgId)
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
    if (this.messages.length < 20) return;
    let lastMsgId = this.messages[this.messages.length - 1]._id;

    this.messageService
      .appendDown(this.idConv, lastMsgId)
      .subscribe((msgs: any) => {
        if (msgs.length < 20) {
          this.noMoreDown = true;
        }
        this.messages = this.messages.concat(msgs);
        setTimeout(() => {
          this.updateBottom();
          this.scrollDown();
        }, 10);
      });
  }
  //convert a date to a usable string
  date(msg: any): string {
    let myid = JSON.parse(localStorage.getItem('user') || '{}')._id;
    let res = '';
    if (msg.sender._id == myid) {
      res =
        this.add0(this.getTypeDateOf(msg.date).getHours()) +
        ':' +
        this.add0(this.getTypeDateOf(msg.date).getMinutes()) +
        ' ' +
        this.add0(this.getTypeDateOf(msg.date).getFullYear()) +
        '-' +
        this.add0(this.getTypeDateOf(msg.date).getMonth()) +
        '-' +
        this.getTypeDateOf(msg.date).getDate();
    } else {
      res =
        this.getTypeDateOf(msg.date).getFullYear() +
        '-' +
        this.add0(this.getTypeDateOf(msg.date).getMonth()) +
        '-' +
        this.add0(this.getTypeDateOf(msg.date).getDate()) +
        ' ' +
        this.add0(this.getTypeDateOf(msg.date).getHours()) +
        ':' +
        this.add0(this.getTypeDateOf(msg.date).getMinutes());
    }
    return res;
  }

  hour(msg: any): string {
    let myid = JSON.parse(localStorage.getItem('user') || '{}')._id;
    let res = '';
    if (msg.sender._id == myid) {
      res =
        this.add0(this.getTypeDateOf(msg.date).getHours()) +
        ':' +
        this.add0(this.getTypeDateOf(msg.date).getMinutes());
    } else {
      res =
        this.add0(this.getTypeDateOf(msg.date).getHours()) +
        ':' +
        this.add0(this.getTypeDateOf(msg.date).getMinutes());
    }
    return res;
  }
  //add 0 to a number if it's less than 10=> for the month and the day of the date
  add0(str: number) {
    return str < 10 ? '0' + str : str;
  }
  //change the conversation
  //empty messages and load the new messages
}
