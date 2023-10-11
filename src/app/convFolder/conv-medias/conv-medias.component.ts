import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/Services/message.service';

@Component({
  selector: 'app-conv-medias',
  templateUrl: './conv-medias.component.html',
  styleUrls: ['./conv-medias.component.css'],
})
export class ConvMediasComponent {
  done = false;
  msgs: any[] = [];
  medias: any[] = [];
  constructor(private messageService: MessageService, private router: Router) {
    this.messageService.getMedias().subscribe((data: any) => {
      this.msgs = data;
      for (let msg of this.msgs) {
        for (let file of msg.files) {
          this.medias.push({ file: file, msg: msg });
        }
      }
      this.done = true;
    });
  }
  goToMsg(msg: any) {
    localStorage.setItem('idMessage', msg._id);
    this.router.navigate(['/conv/messages']);
  }
}
