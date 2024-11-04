import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-search-admin',
  templateUrl: './search-admin.component.html',
  styleUrls: ['./search-admin.component.css'],
})
export class SearchAdminComponent implements OnInit {
  @Output() keyChange = new EventEmitter<string>();
  key: string = '';

  constructor(private userService: UserService) {
    this.key = localStorage.getItem('key') || '';
  }
  ngOnInit(): void {
    let key = document.getElementById('key') as HTMLInputElement;
    key?.focus();
  }

  search() {
    localStorage.setItem('key', this.key);
    this.userService.setKey(this.key);
  }

  cancel() {
    this.keyChange.emit('');
    this.key = '';
    localStorage.removeItem('key');
  }
}
