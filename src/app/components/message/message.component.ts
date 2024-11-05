import { Component, Input, Output } from '@angular/core';
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
  @Output() emitSelectedMessage: EventEmitter<Message> = new EventEmitter();

  @Output() emitSetMessageToDealWith: any = new EventEmitter();
  canDeleteMsgForAll: boolean = false;
  @Input() isClicked: boolean = false;
  members: User[] = [];
  emojis = ['👍', '🌸', '❤️', '🐼'];
  @Input() isLastMessage: boolean = false;
  @Input() message: Message = {
    _id: '',
    conv: '',
    text: '',
    files: [],
    date: new Date(),
    ref: '',
    visibility: [],
    sender: {} as User,
    typeMsg: '',
    reactions: [],
  };
  @Input() precedentMessage: Message = this.message;
  @Input() nextMessage: Message = this.message;
  @Input() index: number = 0;
  @Input() isSelected: boolean = false;
  @Input() isSelectingMode: boolean = false;
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
  getThisUser(): User {
    return this.userService.getThisUser();
  }
  setMessageClicked() {
    this.isClicked = !this.isClicked;
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

  displayOptions() {
    this.emitDisplayOptions.emit(this.message);
  }
  displayPhoto(file: string) {
    this.emitDisplayPhoto.emit(file);
  }
  //FIXME files hidden for other user
  displayReacters() {
    this.emitDisplayReacters.emit(this.message);
  }
  goToReferedMessage(id: string) {
    this.emitGoToReferedMessage.emit(id);
  }
  selectedMessage() {
    this.emitSelectedMessage.emit(this.message);
  }
  isSamePrecedent(): boolean {
    return (
      !this.precedentMessage.sender ||
      this.index == 0 ||
      (this.index != 0 &&
        this.precedentMessage.sender._id != this.message.sender._id)
    );
  }
  isMyMessage(): boolean {
    return this.getThisUser()._id == this.message.sender._id;
  }
  getTailwindClasses(level: number, justBg: boolean) {
    return this.userService.getTailwindThemeClasses(
      this.convService.getThisConv().theme,
      level,
      justBg
    );
  }
  getTriangleClasses() {
    return {
      'border-l-white': this.getConv().theme == 'basic' && this.isMyMessage(),
      'border-l-pink-700': this.getConv().theme == 'love' && this.isMyMessage(),
      'border-l-black': this.getConv().theme == 'panda' && this.isMyMessage(),
      'border-l-green-700':
        this.getConv().theme == 'spring' && this.isMyMessage(),
      'border-r-white': this.getConv().theme == 'basic' && !this.isMyMessage(),
      'border-r-pink-700':
        this.getConv().theme == 'love' && !this.isMyMessage(),
      'border-r-black': this.getConv().theme == 'panda' && !this.isMyMessage(),
      'border-r-green-700':
        this.getConv().theme == 'spring' && !this.isMyMessage(),

      rightTriangle: this.isMyMessage(),
      leftTriangle: !this.isMyMessage(),
    };
  }
  getreferedMessageClassses() {
    return {
      'flex-row-reverse': this.isMyMessage(),
      ...this.getTailwindClasses(1, false),
    };
  }
  getTextClasses() {
    return {
      ...this.getTailwindClasses(3, false),
    };
  }
  isUserImgDisplayed() {
    return (
      (!this.nextMessage.sender ||
        this.message.sender._id != this.nextMessage.sender._id) &&
      !this.isMyMessage()
    );
  }
}
