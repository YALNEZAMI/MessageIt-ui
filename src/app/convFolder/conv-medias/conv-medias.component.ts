import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/Services/message.service';
import { SessionService } from 'src/app/Services/session.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-conv-medias',
  templateUrl: './conv-medias.component.html',
  styleUrls: ['./conv-medias.component.css'],
})
export class ConvMediasComponent {
  done = false;
  msgs: any[] = [];
  medias: any[] = [];
  constructor(
    private messageService: MessageService,
    private router: Router,
    private sessionService: SessionService,
    private webSocketService: WebSocketService
  ) {
    this.messageService.getMedias().subscribe((data: any) => {
      this.msgs = data;
      for (let msg of this.msgs) {
        for (let file of msg.files) {
          this.medias.push({ file: file, msg: msg });
        }
      }
      //set media in local storage
      this.sessionService.setThisMedias(this.medias);
      this.done = true;
    });

    //set subscription to new messages
    this.webSocketService.newMessage().subscribe((msg: any) => {
      if (this.sessionService.getThisConv()._id == msg.conv) {
        this.medias = this.sessionService.getThisMedias();
      }
      //set delete media
      this.webSocketService.messageDeleted().subscribe((msg: any) => {
        this.medias = this.sessionService.getThisMedias();
      });
    });
  }
  goToMsg(msg: any) {
    localStorage.setItem('idMessage', msg._id);
    this.router.navigate(['/conv/messages']);
  }
  fileType(file: string) {
    return this.messageService.fileType(file);
  }
}
