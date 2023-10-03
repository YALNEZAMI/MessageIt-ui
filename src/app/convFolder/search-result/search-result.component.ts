import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/Services/message.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent {
  noRes = false;
  key: string = '';
  messages: any[] = [];
  constructor(private messageService: MessageService, private router: Router) {
    if (localStorage.getItem('keySearchMessages') != null) {
      this.key = localStorage.getItem('keySearchMessages') || '';
      this.search();
    }
    this.messageService.getSearchKey().subscribe((key: string) => {
      this.key = key;
      this.search();
    });
  }
  search() {
    if (this.key == '') {
      this.messages = [];
      this.noRes = false;
      return;
    }
    this.messageService.getMessagesByKey(this.key).subscribe((data: any) => {
      this.messages = data;
      if (this.messages.length == 0) {
        this.noRes = true;
      } else {
        this.noRes = false;
      }
    });
  }
  getDate(dateString: string) {
    let date = new Date(dateString);
    return date.toLocaleDateString();
  }
  getHoure(dateString: string) {
    let date = new Date(dateString);
    let hour = date.getHours();
    if (hour < 10) hour = Number('0' + hour);
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = Number('0' + minutes);
    return hour + ':' + minutes;
  }
  getShortText(text: string) {
    if (text.length > 20) {
      return text.slice(0, 20) + '...';
    } else {
      return text;
    }
  }
  goToMessage(msg: any) {
    let idMsg = msg._id;
    this.messageService.getRange(msg.conv, idMsg).subscribe((res: any) => {
      localStorage.setItem('idMessage', idMsg);
      this.router.navigate(['/conv/messages']);
    });
  }
}
