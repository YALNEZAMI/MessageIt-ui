import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-conv',
  templateUrl: './conv.component.html',
  styleUrls: ['./conv.component.css'],
})
export class ConvComponent {
  constructor(private router: Router) {
    if (localStorage.getItem('conv') == null) {
      this.router.navigate(['admin/convs']);
    }
  }
  returnToConvs() {
    localStorage.removeItem('conv');
    this.router.navigate(['admin/convs']);
  }
}
