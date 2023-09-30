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
  firstMsg: any;
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
      this.messages = [];
      localStorage.setItem('conv', JSON.stringify(conv));
      this.limit = 0;
      this.loadMessages();
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

        this.lastMsg = this.messages[this.messages.length - 1];
        this.firstMsg = this.messages[0];
        // document.getElementById(this.messages[0]._id) ||
        // document.createElement('div');

        //scroll to last message
        // setTimeout(() => {
        // this.scrollDown();
        // }, 200);

        let firstMsgHtml: HTMLElement = document.createElement('div');
        if (this.firstMsg != undefined || this.firstMsg != null) {
          firstMsgHtml =
            document.getElementById(this.firstMsg._id) ||
            document.createElement('div');
        }

        if (this.firstMsg != undefined || this.firstMsg != null) {
          const options = {
            root: null, // Use the viewport as the root
            rootMargin: '0px', // You can adjust this margin as needed
            threshold: 0.1, // Adjust the threshold (0.1 means 10% of the target must be visible)
          };
          this.handleIntersection = this.handleIntersection.bind(this); // Bind the function
          const observer = new IntersectionObserver(
            this.handleIntersection,
            options
          );
          observer.observe(firstMsgHtml);
        }

        // }, 200);
        setTimeout(() => {
          this.scrollDown();
        }, 200);
      });
    //websocket subscribe
    this.messageService.newMessage().subscribe(async (message: any) => {
      let realMessage = await message;
      this.messages.push(await message);
      //scroll down
      if (this.isBottom) {
        setTimeout(() => {
          this.scrollDown();
        }, 100);
      } //set the last message
      setTimeout(() => {
        let element =
          document.getElementById(realMessage._id) ||
          document.createElement('div');
        this.lastMsg = element;
      }, 100);
    });

    //get My Messege response
    this.messageService.getMessageResponse().subscribe(async (message: any) => {
      let realMessage = await message;
      // console.log(realMessage);

      this.messages.push(realMessage);

      setTimeout(() => {
        if (this.isBottom) {
          this.scrollDown();
        } else {
          this.updateBottom();
        }
      });
    }, 100);
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

  async handleIntersection(entries: any, observer: any) {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (entry.isIntersecting && !this.loading) {
        this.loadMessages();
      }
    }
  }
  //on the top of the page => load 20 messages if it exist
  async loadMessages() {
    this.loading = true;
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
        for (let index = 0; index < this.getMessages().length; index++) {
          const element = this.getMessages()[index];
          set.add(element);
        }
        this.messages = Array.from(set);

        this.limit += 20;
        this.done = true;
        this.lastMsg = this.messages[this.messages.length - 1];
        this.firstMsg =
          document.getElementById(this.messages[0]._id) ||
          document.createElement('div');
        this.loading = false;
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
