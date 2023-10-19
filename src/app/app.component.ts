import { Component, OnDestroy } from '@angular/core';
import { SessionService } from './Services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'front';

  constructor(private sessionService: SessionService) {
    if (localStorage.getItem('user') == null) {
      this.sessionService.logout();
    }
  }
  ngOnDestroy(): void {}
}
