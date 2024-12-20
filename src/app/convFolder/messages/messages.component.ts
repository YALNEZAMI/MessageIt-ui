import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from 'src/app/Interfaces/message.interface';
import { ConvService } from 'src/app/Services/conv.service';
import { MessageService } from 'src/app/Services/message.service';
import { SessionService } from 'src/app/Services/session.service';
import { UserService } from 'src/app/Services/user.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: [
    './messages.component.css',
    './messages2.component.css',
    './messages3.component.css',
  ],
})
export class MessagesComponent implements OnInit {
  selectedMessages: Message[] = [];
  isDisplayingOptions: boolean = false;
  isSelectingMode: boolean = false;
  availablerReactions = ['👍', '❤️', '😂', '😯', '😢', '😡'];
  isDisplayingReacters: boolean = false;
  reacters: any[] = [];
  canDeleteMsgForAll = false; //if the user can delete the message for all
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
  messageToDealWith: any;
  thereIsViewvers: boolean = false;
  //msg to reply to
  rep: any;
  @ViewChild('chatContainer') chatContainer: ElementRef = new ElementRef('');
  conv: any = JSON.parse(localStorage.getItem('conv') || '{}');
  MoreMessages: boolean = true;
  private members = this.conv.members;
  private messages: any[] = [];
  constructor(
    private messageService: MessageService,
    private convService: ConvService,
    private webSocketService: WebSocketService,
    private sessionService: SessionService,
    private userService: UserService
  ) {
    //subscribe to reactions
    this.webSocketService.onReaction().subscribe((reaction: any) => {
      //if we are in different conv return
      if (this.convService.getThisConv()._id != reaction.message.conv) return;

      this.messages.map((msg: any) => {
        if (msg._id == reaction.message._id) {
          if (reaction.type == 'none') {
            //delete reaction case
            msg.reactions = msg.reactions.filter((reac: any) => {
              return reac.user._id != reaction.user._id;
            });
          } else {
            let add = true;
            msg.reactions.map((reac: any) => {
              if (reac.user._id == reaction.user._id) {
                //update reaction case
                reac.type = reaction.type;
                add = false;
              }
            });
            if (add) {
              //add reaction case
              msg.reactions.push(reaction);
            }
          }
        }
      });
    });

    //subscribe to change the conversation event
    this.convService.getConvChanged().subscribe((conv: any) => {
      //check if the conv is the same
      if (conv._id == this.conv._id) return;
      localStorage.removeItem('rangeMessageSearched');
      localStorage.removeItem('idMessage');
      localStorage.setItem('conv', JSON.stringify(conv));
      this.conv._id = conv._id;
      this.loading = false;
      this.done = false;
      this.messages = [];
      //if there are convs no need to retrive from database
      if (this.sessionService.thereAreConvs()) {
        //set conv in local storage
        this.sessionService.setThisConv(conv);
        //get messages from local storage
        this.messages = this.sessionService.getConvById(conv._id).messages;

        //set conv like seen by me
        this.messageService.setVus().subscribe((res: any) => {});
        //set a timoute for the loading of the page
        setTimeout(() => {
          this.scrollDown();
          this.done = true;
        }, 100);
      } else {
        this.messageService
          .findMessageOfConv(conv._id)
          .subscribe((msgs: any) => {
            this.messages = msgs;
            //set conv like seen by me
            this.messageService.setVus().subscribe((res: any) => {});

            setTimeout(() => {
              this.scrollDown();
              this.done = true;
            }, 100);
          });
      }
    });
    //set conv like seen by me
    this.messageService.setVus().subscribe((res: any) => {});

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
            localStorage.removeItem('idMessage');
          }, 100);
          this.done = true;
          //reinit the idMessage
        });
    } else {
      //get messages from local storage if exist
      if (
        this.sessionService.thereAreMessages(
          this.sessionService.getThisConv()._id
        )
      ) {
        this.messages = this.sessionService.getThisMessages();
        this.done = true;
        this.setViewers();
        //scroll down
        this.scrollDown();
      } else {
        //get initial messages without search
        this.messageService
          .findMessageOfConv(this.conv._id)
          .subscribe(async (msgs: any) => {
            //set global messages and properties
            this.messages = await msgs;
            //set messages in local storage
            this.sessionService.setThisMessages(this.messages);
            this.done = true;
            this.setViewers();

            //scroll down
            setTimeout(() => {
              this.scrollDown();
            }, 10);
          });
      }
    }

    //websocket subscribe for new message
    this.webSocketService.newMessage().subscribe(async (message: any) => {
      let realMessage = await message;
      let idConv = realMessage.conv;

      if (idConv == this.conv._id) {
        //set therisViewers to false
        this.setThereIsViewvers(false);
        this.messages.push(realMessage);
        //add to local storage
        this.sessionService.addMessage(realMessage);
        // on new message, set the conv like seen by me
        this.messageService.setVus().subscribe((res: any) => {});
        //scroll down, according to msg size (loading time if files ++)
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
    //websocket updating vus
    this.webSocketService.setVus().subscribe(async (data: any) => {
      if (data.idConv == this.conv._id) {
        this.updateViewers(data);
        let idUser = data.myId;
        if (idUser != this.getThisUser()._id) {
          //set there is viewers to true
          this.setThereIsViewvers(true);
          setTimeout(() => {}, 1000);
        }
      }
    });
    //websocket message deleted
    this.webSocketService.messageDeleted().subscribe(async (object: any) => {
      //object:{idMsg:string,idUser:string,memberLength:number,operation:'deleteForMe'||'deleteForAll}
      if (object.operation == 'deleteForAll') {
        this.messages = this.messages.filter((msg) => {
          return msg._id != object.idMsg;
        });
      } else {
        if (
          object.idUser == this.getThisUser()._id &&
          object.operation == 'deleteForMe'
        ) {
          this.messages = this.messages.filter((msg) => {
            return msg._id != object.idMsg;
          });
        }
      }
    });
    //subscribe to recieve event
    this.webSocketService.onRecievedMessage().subscribe((message: any) => {
      this.messages.map((msg) => {
        if (msg._id == message._id) {
          msg.recievedBy = message.recievedBy;
        }
      });
    });

    //update bottom
    this.updateBottom();
  }
  ngOnInit(): void {
    this.messageToDealWith = this.messages[0];

    this.setViewers();
  }
  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  getMembers() {
    return this.members;
  }
  updateViewers(object: {
    idConv: string;
    myId: string; //idUser
  }) {
    this.members.map((member: any) => {
      if (member._id == object.myId) {
        member.lastMsgSeen = this.messages[this.messages.length - 1];
      }
    });
    this.messages.map((msg) => {
      if (msg.conv == object.idConv && !msg.vus.includes(object.myId)) {
        msg.vus.push(object.myId);
      }
    });
    if (this.isBottom) {
      this.scrollDown();
    }
  }
  setThereIsViewvers(bool: boolean) {
    this.thereIsViewvers = bool;
  }
  getThereIsViewvers(msg: any) {
    return msg.vus.length > 1;
  }

  //set me as viewer of the conv
  setViewers() {
    for (let i = 0; i < this.members.length; i++) {
      const member = this.members[i];
      for (let i = 0; i < this.messages.length; i++) {
        const msg = this.messages[i];
        if (
          msg.vus.includes(member._id) &&
          member._id != this.getThisUser()._id
        ) {
          member.lastMsgSeen = msg;
        }
      }
    }
  }
  // setThisVus(data: any) {}
  displayPhoto(file: string) {
    this.photoDisplayedUrl = file;
    console.log('photoDisplayedUrl', this.photoDisplayedUrl);
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
      // chatContainer.scrollTo(0, height);
      chatContainer.scrollTop = chatContainer.scrollHeight;
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
      const chatBox: any = msg.getElementsByClassName('chat-text')[0];
      let originalBgColor = '';
      let originalColor = '';

      if (chatBox) {
        originalBgColor = chatBox.style.background;
        originalColor = chatBox.style.color;
        chatBox.style.background = 'var(--shadow-color)';
        chatBox.style.color = 'red';
      } else {
        msg.style.background = 'var(--shadow-color)';
      }
      setTimeout(() => {
        msg!.style.background = 'transparent';
        chatBox.style.background = originalBgColor;
        chatBox.style.color = originalColor;
      }, 2000);
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
      myPhotoSentContainer: idUser == this.getThisUser()._id,
      otherPhotoSentContainer: idUser != this.getThisUser()._id,
    };
  }
  getChatClasses(msg: any) {
    let idUser = msg.sender._id;

    let firstRes = {
      emoji: false,
      right: idUser == this.getThisUser()._id,
      'chat-right': idUser == this.getThisUser()._id,
      'chat-left': idUser != this.getThisUser()._id,
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
    if (this.conv.theme == 'basic') {
      res = {
        'text-white': true,
        ...res,
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
        //apendup in local storage
        this.sessionService.appendUp(msgs);
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
      this.setViewers();
      for (let i = 0; i < this.members.length; i++) {
        const member = this.members[i];
        this.updateViewers({ idConv: this.conv._id, myId: member._id });
      }
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

  displayOptions(msg: any) {
    //filter delete options
    if (msg != null && msg.sender._id == this.getThisUser()._id) {
      this.canDeleteMsgForAll = true;
    } else {
      this.canDeleteMsgForAll = false;
    }
    //set the concerned message
    this.messageToDealWith = msg;
    //display or hide the options div
    this.isDisplayingOptions = !this.isDisplayingOptions;
  }
  deleteMsgForAll() {
    this.messageService
      .deleteMsgForAll(this.messageToDealWith)
      .subscribe((res) => {
        //update photo viewers
        this.setViewers();
      });
  }
  deleteMsgForMe() {
    this.messageService
      .deleteMsgForMe(this.messageToDealWith)
      .subscribe((res) => {
        //update photo viewers
        this.setViewers();
      });
  }

  //rep
  getRepClasses() {
    let idSender = this.messageToDealWith.sender._id;
    let myid = this.getThisUser()._id;
    return {
      bi: true,
      'bi-box-arrow-in-down-left': idSender == myid,
      'bi-box-arrow-in-down-right': idSender != myid,
      rotateTheirRepArrow: idSender != myid,
    };
  }
  getSettingsAndRepClasses(msg: any) {
    let idSender = msg.sender._id;
    let myid = this.getThisUser()._id;
    return {
      row: true,
      marginRightSettingAndRep: idSender == myid,
      marginLeftSettingAndRep: idSender != myid,
    };
  }
  isRepling = false;
  setRep() {
    this.isRepling = true;
    this.messageService.setRep(this.messageToDealWith);
  }
  getRepOfMsgsClasses(msg: any) {
    return {
      row: true,
      repRight: msg.sender._id == this.getThisUser()._id,
      repLeft: msg.sender._id != this.getThisUser()._id,
    };
  }
  isLastMsg(msg: any) {
    return msg._id == this.messages[this.messages.length - 1]._id;
  }
  // getMyReaction0(msg: any) {
  //   let reactions = msg.reactions;
  //   for (let i = 0; i < reactions.length; i++) {
  //     const reaction = reactions[i];
  //     if (reaction.user._id == this.getThisUser()._id) {
  //       return reaction.type;
  //     }
  //   }
  //   return '';
  // }
  getMyReaction() {
    let reactions;
    if (this.messageToDealWith == null || this.messageToDealWith == undefined) {
      reactions = [];
    } else {
      reactions = this.messageToDealWith.reactions;
    }
    for (let i = 0; i < reactions.length; i++) {
      const reaction = reactions[i];
      if (reaction.user._id == this.getThisUser()._id) {
        return reaction.type;
      }
    }
    return '';
  }
  // displayReactions(msg: any) {
  //   let reactionsContainer = document.getElementById(
  //     msg._id + '-reactionsContainer'
  //   ) as HTMLElement;

  //   if (reactionsContainer.style.display == 'flex') {
  //     reactionsContainer.style.display = 'none';
  //   } else {
  //     reactionsContainer.style.display = 'flex';
  //   }
  // }
  displayReacters(msg: Message | null) {
    console.log('msg', msg);
    if (msg == null) {
      this.isDisplayingReacters = false;
    } else {
      this.reacters = msg.reactions;
      this.isDisplayingReacters = true;
    }
  }
  // addReaction0(msg: any, reaction: any) {
  //   this.displayReactions(msg);
  //   this.messageService.addReaction(msg, reaction).subscribe((res) => {});
  // }
  addReaction(reaction: any) {
    // this.displayReactions(this.messageToDealWith);
    this.messageService
      .addReaction(this.messageToDealWith, reaction)
      .subscribe((res) => {});
  }
  getReactions(msg: any) {
    let reactions = new Set();
    for (let i = 0; i < msg.reactions.length; i++) {
      const reaction = msg.reactions[i];
      reactions.add(reaction.type);
    }
    let res: any[] = Array.from(reactions);

    return res;
  }
  getNbrOfReaction(type: string) {
    let nbr = 0;
    this.messages.map((msg) => {
      msg.reactions.map((reaction: any) => {
        if (reaction.type == type) {
          nbr++;
        }
      });
    });
    return nbr;
  }
  fileType(file: string) {
    return this.messageService.fileType(file);
  }
  getNotifText(msg: any) {
    return this.messageService.getNotifText(msg);
  }
  getClassesOfStatus(msg: any) {
    if (msg.typeMsg == 'message') {
      return {
        'd-flex': true,
        'flex-row-reverse': true,
        // 'flex-row-reverse': msg.sender._id == this.getThisUser()._id,
        // 'flex-row': msg.sender._id != this.getThisUser()._id,
        statusRow: true,
      };
    } else {
      return {
        'd-flex': true,
        'flex-row-reverse': true,
      };
    }
  }
  sentConditions(msg: any) {
    return this.isLastMsg(msg) && this.messageService.sentConditions(msg);
  }
  recievedConditions(msg: any) {
    return this.isLastMsg(msg) && this.messageService.recievedConditions(msg);
  }
  getPrecedentMessage(i: number): Message {
    if (i == 0) {
      return {} as Message;
    }
    return this.getMessages()[i - 1];
  }
  getNextMessage(i: number): Message {
    if (i == this.getMessages().length - 1) {
      return {} as Message;
    }
    return this.getMessages()[i + 1];
  }
  SelectMessage(selectedMessage: Message): void {
    this.onSelectingMessage(selectedMessage);
    this.isSelectingMode = true;
    this.isDisplayingOptions = false;
  }
  isSelectedMessage(selectedMessage: Message): boolean {
    let res: boolean = false;
    this.selectedMessages.map((sm) => {
      if (sm._id == selectedMessage._id) {
        res = true;
      }
    });
    return res;
  }
  onSelectingMessage(selectedMessage: Message) {
    if (this.isSelectedMessage(selectedMessage)) {
      this.selectedMessages = this.selectedMessages.filter((sm) => {
        return sm._id != selectedMessage._id;
      });
    } else {
      this.selectedMessages.push(selectedMessage);
    }
  }
  cancelSelection() {
    this.isSelectingMode = false;
    this.selectedMessages = [];
  }
  deleteSelectionForMe() {
    this.selectedMessages.map((m) => {
      this.messageToDealWith = m;
      this.deleteMsgForMe();
    });
    this.cancelSelection();
  }
  deleteSelectionForAllIfPossible() {
    this.selectedMessages.map((m) => {
      this.messageToDealWith = m;
      console.log('m', m);
      if (m.sender._id == this.getThisUser()._id) {
        this.deleteMsgForAll();
      } else {
        this.deleteMsgForMe();
      }
    });
    this.cancelSelection();
  }
  getTailwindClasses(level: number, justBg: boolean) {
    return this.userService.getTailwindThemeClasses(
      this.convService.getThisConv().theme,
      level,
      justBg
    );
  }
  getThirdCommonColor() {
    return this.userService.getThirdCommonColor();
  }
}
