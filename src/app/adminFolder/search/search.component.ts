import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  @Input() key: string = '';
  // users: any[] = [];
  // convs: any[] = [];
  userOrConv: string = 'users';
  constructor(private router: Router) {}
  getUserOrConv() {
    let route = this.router.url;
    let split = route.split('/');
    let lastRoute = split[split.length - 1];
    return lastRoute;
  }
}
