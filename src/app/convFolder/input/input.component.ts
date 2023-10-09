import { Component, ElementRef, ViewChild } from '@angular/core';
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
  fileInput: any;
  filesNumber: number = 0;
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

  selectFiles() {
    setTimeout(() => {
      this.fileInput.click();
      // document.getElementById('files')?.click();
    }, 100);
  }
  mediasChange() {
    if (this.fileInput.files != null) {
      if (this.fileInput.files.length != 0) {
        this.sendButton = true;
        this.filesNumber = this.fileInput.files.length;
      }
    }
  }
  reinitMedias() {
    this.fileInput.value = '';
    this.filesNumber = 0;
  }
  getFilesBtnClasses() {
    return {
      btn: true,
      'btn-success': this.filesNumber == 0,
      'btn-danger': this.filesNumber != 0,
    };
  }

  send() {
    //check if message is empty
    if (this.message.text == '' && this.filesNumber == 0) {
      return;
    }
    //send files
    if (this.filesNumber != 0) {
      this.messageService
        .sendFiles(this.fileInput.files)
        .subscribe((res) => {});
    }

    //send message
    this.messageService.send(this.message).subscribe((res: any) => {});
    //empty message
    this.reinitRep();
    this.reinitMedias();
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
