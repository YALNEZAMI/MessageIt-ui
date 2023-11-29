import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { env } from '../../../env';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent {
  constructor(private router: Router) {
    let dom: string = env.front_url;
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
      // window.location.href = dom + '/auth/login';
    }, 2000);
  }
}
