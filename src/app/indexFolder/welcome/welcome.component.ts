import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { env } from '../../../env';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent {
  constructor() {
    let dom: string = env.front_url;
    setTimeout(() => {
      window.location.href = dom + '/auth/login';
    }, 2000);
  }
}
