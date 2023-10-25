import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-content',
  templateUrl: './index-content.component.html',
  styleUrls: ['./index-content.component.css'],
})
export class IndexContentComponent {
  constructor(private router: Router) {
    if (this.getThisUser() != null) {
      this.router.navigate(['/admin/convs']);
    }
  }
  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getRoute() {
    let url = this.router.url;
    let split = url.split('/');
    return split[split.length - 1];
  }
}
