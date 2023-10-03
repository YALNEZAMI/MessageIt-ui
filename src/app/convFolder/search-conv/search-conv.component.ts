import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/Services/message.service';

@Component({
  selector: 'app-search-conv',
  templateUrl: './search-conv.component.html',
  styleUrls: ['./search-conv.component.css'],
})
export class SearchConvComponent {
  constructor(private router: Router, private messageService: MessageService) {
    setTimeout(() => {
      let input = document.getElementById('key');
      if (input) input.focus();
    }, 100);

    if (localStorage.getItem('keySearchMessages') != null) {
      this.key = localStorage.getItem('keySearchMessages') || '';
    }
  }
  key: string = '';
  search() {
    this.messageService.setSearchKey(this.key);
  }
  cancel() {
    this.key = '';
    localStorage.removeItem('keySearchMessages');
    this.router.navigate(['/conv/messages']);
  }
}
