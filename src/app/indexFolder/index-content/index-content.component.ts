import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-content',
  templateUrl: './index-content.component.html',
  styleUrls: ['./index-content.component.css'],
})
export class IndexContentComponent {
  constructor(private router: Router) {}

  getRoute() {
    let url = this.router.url;
    let split = url.split('/');
    return split[split.length - 1];
  }
}
