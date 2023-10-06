import { Component } from '@angular/core';
import { Message } from 'src/app/Interfaces/message.interface';
import { ConvService } from 'src/app/Services/conv.service';
import { MessageService } from 'src/app/Services/message.service';
import { SessionService } from 'src/app/Services/session.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent {
  me = JSON.parse(localStorage.getItem('user') || '{}');
  message: Message = {
    conv: '',
    text: '',
    files: [],
    date: new Date(),
    ref: '',
    invisiblity: [],
    sender: JSON.parse(localStorage.getItem('user') || '{}')._id,
  };
  sendButton: boolean = false;
  photoRep: string = 'http://localhost:3000/user/uploads/user.png';
  textRep: string = 'error';
  constructor(
    private sessionService: SessionService,
    private messageService: MessageService
  ) {
    //get msg id to rep to
    this.messageService.getRep().subscribe((msg: any) => {
      this.message.ref = msg._id;
      this.fillRep(msg);
    });
  }

  selectFiles() {
    document.getElementById('files')?.click();
  }
  send() {
    //online
    this.sessionService.online().subscribe((data: any) => {});
    //check if message is empty
    if (this.message.text == '' && this.message.files.length == 0) {
      return;
    }
    //send message
    this.messageService.send(this.message).subscribe((res: any) => {
      // this.messageService.setMessageResponse(res);
    });
    //empty message
    this.reinitRep();
    this.emptyMessage();
  }
  emptyMessage() {
    this.message.text = '';
    this.message.files = [];
    this.sendButton = false;
  }
  like() {
    this.message.text = '⭐';
    this.send();
  }
  onInput() {
    if (this.message.text == '') {
      this.sendButton = false;
    } else {
      this.sendButton = true;
    }
  }
  fillRep(msg: any) {
    if (msg != null) {
      this.photoRep = msg.sender.photo;
      this.textRep = msg.text;
      let rep = document.getElementById('rep') as HTMLElement;
      rep.style.display = 'flex';
    }
  }
  cancelRep() {
    this.reinitRep();
  }
  reinitRep() {
    this.message.ref = '';
    let rep = document.getElementById('rep') as HTMLElement;
    rep.style.display = 'none';
  }
}
