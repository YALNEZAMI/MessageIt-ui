import { Component, Input } from '@angular/core';
import { Message } from 'src/app/Interfaces/message.interface';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  @Input() message: Message = {
    conv: '',
    text: '',
    files: [],
    date: new Date(),
    ref: '',
    visibility: [],
    sender: { _id: '' },
    typeMsg: '',
  };
}
