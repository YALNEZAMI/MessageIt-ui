import { Component, Input, Output } from '@angular/core';
import { Conv } from 'src/app/Interfaces/conv.interface';
import { Message } from 'src/app/Interfaces/message.interface';
import { User } from 'src/app/Interfaces/User.interface';
import { ConvService } from 'src/app/Services/conv.service';
import { MessageService } from 'src/app/Services/message.service';
import { UserService } from 'src/app/Services/user.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  @Output() emitDisplayOptions: EventEmitter<Message> = new EventEmitter();
  @Output() emitDisplayPhoto: EventEmitter<string> = new EventEmitter();
  @Output() emitDisplayReacters: EventEmitter<Message> = new EventEmitter();
  @Output() emitGoToReferedMessage: EventEmitter<string> = new EventEmitter();
  @Output() emitSetMessageToDealWith: any = new EventEmitter();
  canDeleteMsgForAll: boolean = false;
  @Input() isClicked: boolean = false;
  members: User[] = [];
  @Input() isLastMessage: boolean = false;
  @Input() message: Message = {
    _id: '',
    conv: '',
    text: '',
    files: [],
    date: new Date(),
    ref: '',
    visibility: [],
    sender: {
      _id: '',
      photo: '',
      firstName: '',
      lastName: '',
    },
    typeMsg: '',
    reactions: [],
  };
  constructor(
    private messageService: MessageService,
    private convService: ConvService,
    private userService: UserService
  ) {
    //fetch members
    this.convService.getMembers().subscribe((members: any) => {
      this.members = members;
    });
  }
  getConv() {
    return this.convService.getThisConv();
  }
  getClassesOfStatus() {
    if (this.message.typeMsg == 'message') {
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
  sentConditions() {
    return (
      this.isLastMessage && this.messageService.sentConditions(this.message)
    );
  }
  recievedConditions() {
    return (
      this.isLastMessage && this.messageService.recievedConditions(this.message)
    );
  }
  getMembers(): any[] {
    return this.members;
  }
  getThisUser() {
    return this.userService.getThisUser();
  }
  setMessageClicked() {
    this.isClicked = true;
  }
  getNotifText() {
    return this.messageService.getNotifText(this.message);
  }
  //convert a date to a usable string
  date(): string {
    return this.getTypeDateOf(this.message.date).toLocaleString();
  }
  getTypeDateOf(dateString: Date) {
    return new Date(dateString);
  }
  getChatClasses() {
    let idUser = this.message.sender._id;

    let firstRes = {
      emoji: false,
      right: idUser == this.getThisUser()._id,
      'chat-right': idUser == this.getThisUser()._id,
      'chat-left': idUser != this.getThisUser()._id,
    };

    return firstRes;
  }
  getSettingsAndRepClasses() {
    let idSender = this.message.sender._id;
    let myid = this.getThisUser()._id;
    return {
      row: true,
      marginRightSettingAndRep: idSender == myid,
      marginLeftSettingAndRep: idSender != myid,
    };
  }

  textClasses() {
    let text = this.message.text;
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
    if (this.convService.getThisConv().theme == 'basic') {
      res = {
        'text-white': true,
        ...res,
      };
    }

    return res;
  }
  getImgSentContainer() {
    let idUser = this.message.sender._id;

    return {
      row: true,
      myPhotoSentContainer: idUser == this.getThisUser()._id,
      otherPhotoSentContainer: idUser != this.getThisUser()._id,
    };
  }
  fileType(file: string) {
    return this.messageService.fileType(file);
  }
  getReactions() {
    let reactions = new Set();
    for (let i = 0; i < this.message.reactions.length; i++) {
      const reaction = this.message.reactions[i];
      reactions.add(reaction.type);
    }
    let res: any[] = Array.from(reactions);

    return res;
  }
  getNbrOfReaction(type: string) {
    let nbr = 0;
    this.message.reactions.map((reaction: any) => {
      if (reaction.type == type) {
        nbr++;
      }
    });
    return nbr;
  }
  getRepOfMsgsClasses() {
    return {
      row: true,
      repRight: this.message.sender._id == this.getThisUser()._id,
      repLeft: this.message.sender._id != this.getThisUser()._id,
    };
  }
  displayOptions() {
    this.emitDisplayOptions.emit(this.message);
  }
  displayPhoto(file: string) {
    this.emitDisplayPhoto.emit(file);
  }
  displayReacters() {
    this.emitDisplayReacters.emit(this.message);
  }
  goToReferedMessage(id: string) {
    this.emitGoToReferedMessage.emit(id);
  }
}