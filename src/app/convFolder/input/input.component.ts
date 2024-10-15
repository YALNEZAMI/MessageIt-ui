import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/Interfaces/message.interface';
import { ConvService } from 'src/app/Services/conv.service';
import { MessageService } from 'src/app/Services/message.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements OnInit {
  me = JSON.parse(localStorage.getItem('user') || '{}');
  fileInput: any;
  emoji: string = '';
  message: Message = {
    typeMsg: 'message',
    conv: '',
    text: '',
    files: [],
    date: new Date(),
    ref: '',
    visibility: [],
    sender: JSON.parse(localStorage.getItem('user') || '{}')._id,
  };
  sendButton: boolean = false;
  photoRep: string = '';
  textRep: string = '';
  constructor(
    private messageService: MessageService,
    private convService: ConvService
  ) {
    //set emoji
    this.emoji = this.convService.getEmoji();
    //set inputfile
    setTimeout(() => {
      this.fileInput = document.getElementById('files') as HTMLInputElement;
    }, 100);

    //get msg id to rep to
    this.messageService.getRep().subscribe((msg: any) => {
      this.message.ref = msg._id;
      this.fillRep(msg);
    });
  }
  ngOnInit(): void {
    const ta = document.getElementById('textArea') as HTMLTextAreaElement;
    ta.focus();
  }

  selectFiles() {
    this.fileInput.click();
  }
  mediasChange(event: any) {
    if (this.fileInput.files != null) {
      if (this.fileInput.files.length != 0) {
        this.sendButton = true;
        this.message.files = event.target.files;
      }
    }
  }
  reinitMedias() {
    this.fileInput.value = '';
    this.message.files = [];
  }
  getFilesBtnClasses() {
    return {
      btn: true,
      'btn-success': this.message.files.length == 0,
      'btn-danger': this.message.files.length != 0,
    };
  }

  send() {
    //focus on textarea
    let textarea = document.getElementById('textArea') as HTMLElement;
    textarea.focus();
    //check if message is empty
    if (this.message.text == '' && this.message.files.length == 0) {
      return;
    }

    //send message
    this.messageService.send(this.message).subscribe(async (msg: any) => {
      if (msg.text == '') {
        msg.text = 'files';
      }
      this.convService.update({ lastMessage: msg }, null);
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
    this.message.text = this.emoji;
    this.send();
  }
  onInput() {
    if (this.message.text == '') {
      this.sendButton = false;
    } else {
      this.sendButton = true;
    }
  }
  typing() {
    this.convService.typing().subscribe((res) => {});
  }
  fillRep(msg: any) {
    let rep = document.getElementById('rep') as HTMLElement;
    if (msg != null) {
      this.photoRep = msg.sender.photo;
      this.textRep = msg.text;
      if (this.textRep.length > 20) {
        this.textRep = this.textRep.slice(0, 20) + '...';
      } else if (this.textRep == '') {
        this.textRep = 'files';
      }
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
