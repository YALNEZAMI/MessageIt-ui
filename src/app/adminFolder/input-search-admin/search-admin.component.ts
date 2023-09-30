import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-search-admin',
  templateUrl: './search-admin.component.html',
  styleUrls: ['./search-admin.component.css'],
})
export class SearchAdminComponent implements OnDestroy {
  @Output() keyChange = new EventEmitter<string>();
  key: string = '';

  constructor(private routes: Router, private userService: UserService) {
    this.key = localStorage.getItem('key') || '';
  }
  ngOnDestroy(): void {
    localStorage.removeItem('key');
  }

  search() {
    localStorage.setItem('key', this.key);
    this.userService.setKey(this.key);
  }

  cancel() {
    this.keyChange.emit('');
    this.key = '';
    this.routes.navigate(['admin/convs']);
  }
}
