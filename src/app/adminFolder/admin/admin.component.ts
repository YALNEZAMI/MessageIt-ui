import { Component, OnInit, Renderer2 } from '@angular/core';
import { SessionService } from 'src/app/Services/session.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  constructor(private sessionService: SessionService) {
    this.sessionService.online().subscribe((data: any) => {});
  }
  ngOnInit(): void {
    setTimeout(() => {
      let theme = JSON.parse(localStorage.getItem('user') || '{}').theme;
      let doc = document.documentElement;
      let admin = document.getElementById('admin') as HTMLElement;
      if (theme == undefined) {
        theme = 'basic';
      }
      switch (theme) {
        case 'basic':
          break;
        case 'love':
          admin.style.backgroundColor = 'rgba(255, 0, 0,0.3)';
          doc.style.setProperty('--bg-color-admin', 'rgb(255, 105, 180)');
          doc.style.setProperty('--font-color-admin', 'white');
          doc.style.setProperty('--third-color-admin', 'black');
          doc.style.setProperty(
            '--shadow-color-admin',
            'rgba(124, 121, 189, 0.5)'
          );

          break;
        case 'spring':
          admin.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';

          doc.style.setProperty('--bg-color-admin', 'green');
          doc.style.setProperty('--font-color-admin', 'white');
          doc.style.setProperty('--third-color-admin', 'black');
          doc.style.setProperty(
            '--shadow-color-admin',
            'rgba(124, 121, 189, 0.5)'
          );

          break;

        default:
          break;
      }
    }, 1000);
  }
}
