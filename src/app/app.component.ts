import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'front';

  constructor(private router: Router) {
    if (localStorage.getItem('user') == null) {
      router.navigate(['auth/login']);
    }
  }
  ngOnDestroy(): void {
    console.log('offline');
  }
  redirect() {
    this.router.navigate(['/index']);
  }
}
