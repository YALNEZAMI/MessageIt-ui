import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/Services/session.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  constructor(private router: Router) {
    if (localStorage.getItem('user') == null) {
      router.navigate(['/auth/login']);
    }
  }
}
