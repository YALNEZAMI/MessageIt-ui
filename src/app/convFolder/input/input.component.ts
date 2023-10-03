import { Component } from '@angular/core';
import { Message } from 'src/app/Interfaces/message.interface';
import { ConvService } from 'src/app/Services/conv.service';
import { MessageService } from 'src/app/Services/message.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent {
  constructor(
    private convService: ConvService,
    private messageService: MessageService
  ) {}
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
  selectFiles() {
    document.getElementById('files')?.click();
  }
  send() {
    //check if message is empty
    if (this.message.text == '' && this.message.files.length == 0) {
      return;
    }
    // transfer message sent into conv messages

    this.messageService.setMessageSent(this.message);
    //empty message
    let message = this.message;

    //send message
    this.messageService.send(message).subscribe((res: any) => {
      // this.messageService.setMessageResponse(res);
    });
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
}
