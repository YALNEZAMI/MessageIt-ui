import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConvService } from 'src/app/Services/conv.service';
import { SessionService } from 'src/app/Services/session.service';

@Component({
  selector: 'app-conv',
  templateUrl: './conv.component.html',
  styleUrls: ['./conv.component.css'],
})
export class ConvComponent implements OnInit {
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private convService: ConvService
  ) {
    this.sessionService.online().subscribe((data: any) => {});
    if (localStorage.getItem('conv') == null) {
      this.router.navigate(['admin/convs']);
    }
  }
  ngOnInit(): void {
    this.convService.setTheme();
  }
  returnToConvs() {
    localStorage.removeItem('conv');
    this.router.navigate(['admin/convs']);
  }
}
