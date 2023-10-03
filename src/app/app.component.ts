import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { env } from 'src/env';
import { UserService } from './Services/user.service';
import { SessionService } from './Services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'front';

  constructor(private router: Router, private sessionService: SessionService) {
    if (localStorage.getItem('user') == null) {
      router.navigate(['auth/login']);
    }
  }
  ngOnDestroy(): void {}
}
