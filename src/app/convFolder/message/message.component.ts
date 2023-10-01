import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { ConvService } from 'src/app/Services/conv.service';
import { MessageService } from 'src/app/Services/message.service';
import { UserService } from 'src/app/Services/user.service';
import { env } from 'src/env';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent {
  messageClicked: string = '';
  isBottom: boolean = true;
  loading: boolean = false;
  limit: number = 0;
  ref: boolean = false;
  done: boolean = false;
  lastMsg: any;
  @ViewChild('chatContainer') chatContainer: ElementRef = new ElementRef('');
  idConv: string = JSON.parse(localStorage.getItem('conv') || '{}')._id;
  me = JSON.parse(localStorage.getItem('user') || '{}');
  private messages: any[] = [];
  constructor(
    private messageService: MessageService,
    private convService: ConvService,
    private userService: UserService,
    private router: Router,
    private viewContainerRef: ViewContainerRef
  ) {
    //subscribe to change the conversation event
    this.convService.getConvChanged().subscribe((conv: any) => {
      this.reloadMessages();
    });
    let idConv = JSON.parse(localStorage.getItem('conv') || '{}')._id;
    //get initial messages
    this.messageService
      .findMessageOfConv(this.limit, idConv)
      .subscribe(async (data: any) => {
        //set global messages and properties
        this.messages = await data;
        this.limit += 20;
        this.done = true;
        setTimeout(() => {
          if (this.messages.length > 0) {
            this.lastMsg =
              document.getElementById(
                this.messages[this.messages.length - 1]._id
              ) || document.createElement('div');
          }
        }, 10);

        //if a message is searched
        if (localStorage.getItem('idMessage') != null) {
          let idMessage = localStorage.getItem('idMessage') || '';
          setTimeout(async () => {
            this.goToMessage(idMessage);
            localStorage.removeItem('idMessage');
          }, 100);
        } else {
          setTimeout(() => {
            this.scrollDown();
          }, 10);
        }
      });
    //websocket subscribe
    this.messageService.newMessage().subscribe(async (message: any) => {
      let realMessage = await message;
      this.messages.push(await message);
      //scroll down
      if (this.isBottom) {
        setTimeout(() => {
          this.scrollDown();
        }, 5);
      } //set the last message
      setTimeout(() => {
        if (this.messages.length > 0) {
          let element =
            document.getElementById(realMessage._id) ||
            document.createElement('div');
          this.lastMsg = element;
        }
      }, 10);
    });

    //get My Messege response
    this.messageService.getMessageResponse().subscribe(async (message: any) => {
      let realMessage = await message;
      this.messages.push(realMessage);
      setTimeout(() => {
        if (this.isBottom) {
          this.scrollDown();
        } else {
          this.updateBottom();
        }
      });
    }, 5);
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
    // this.isBottom = true;
  }
  scrollDownSmooth() {
    let height = this.chatContainer.nativeElement.scrollHeight;
    let chatContainer = this.chatContainer.nativeElement;
    chatContainer.scrollTo({
      top: height,
      left: 0,
      behavior: 'smooth',
    });
    // this.isBottom = true;
  }
  scrollById(id: string) {
    let element = document.getElementById(id) || document.createElement('div');

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  goToMessage(id: string) {
    let msg = document.getElementById(id);

    if (msg == null) {
      // for (let index = 0; index < 3; index++) {

      this.appendLoadedMessages();

      // }
      setTimeout(() => {
        this.goToMessage(id);
      }, 3000);
    } else {
      if (msg) msg.style.borderBottom = '1px solid red';
      setTimeout(() => {
        if (msg) msg.style.borderBottom = '0px solid red';
      }, 3000);
      msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  checktop() {
    let scrollingDiv = this.chatContainer.nativeElement;
    if (scrollingDiv.scrollTop <= 0) {
      this.appendLoadedMessages();
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

  //on the top of the page => load 20 messages if it exist
  reloadMessages() {
    //reset variables
    this.messages = [];
    this.limit = 0;
    //reget messages
    let idConv = JSON.parse(localStorage.getItem('conv') || '{}')._id;
    this.messageService
      .findMessageOfConv(this.limit, idConv)
      .subscribe(async (data: any) => {
        let realData = await data;
        //set global messages and properties
        //append loaded messages to the global messages
        let set = new Set();
        for (let index = 0; index < realData.length; index++) {
          const element = realData[index];
          set.add(element);
        }
        this.messages = Array.from(set);

        this.limit += 20;

        this.done = true;
        setTimeout(() => {
          this.lastMsg =
            document.getElementById(
              this.messages[this.messages.length - 1]._id
            ) || document.createElement('div');
        }, 10);
      });
  }

  //append 20 messages to the global messages
  //on the top of the page => load 20 messages if it exist
  async appendLoadedMessages() {
    this.loading = true;
    let idConv = JSON.parse(localStorage.getItem('conv') || '{}')._id;
    this.messageService
      .findMessageOfConv(this.limit, idConv)
      .subscribe(async (data: any) => {
        console.log('new', data.length);

        this.messages = await data.concat(this.messages);
        this.limit += 20;
        this.done = true;
        setTimeout(() => {
          if (this.messages.length > 0) {
            this.lastMsg =
              document.getElementById(
                this.messages[this.messages.length - 1]._id
              ) || document.createElement('div');
          }
        }, 10);
        this.loading = false;
        console.log(this.messages.length);
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
