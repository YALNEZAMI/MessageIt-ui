import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-conv',
  templateUrl: './search-conv.component.html',
  styleUrls: ['./search-conv.component.css'],
})
export class SearchConvComponent {
  constructor(private router: Router) {}
  key: string = '';
  search() {}
  cancel() {
    this.key = '';
    this.router.navigate(['/conv/messages']);
  }
}
