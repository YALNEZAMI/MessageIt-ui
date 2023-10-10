import { Component } from '@angular/core';
import { MessageService } from 'src/app/Services/message.service';

@Component({
  selector: 'app-conv-medias',
  templateUrl: './conv-medias.component.html',
  styleUrls: ['./conv-medias.component.css'],
})
export class ConvMediasComponent {
  msgs: any[] = [];
  medias: any[] = [];
  constructor(private messageService: MessageService) {
    this.messageService.getMedias().subscribe((data: any) => {
      this.msgs = data;
      for (let msg of this.msgs) {
        for (let file of msg.files) {
          this.medias.push(file);
        }
      }
    });
  }
}
