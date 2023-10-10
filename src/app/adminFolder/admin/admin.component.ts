import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/Services/session.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  constructor(
    private sessionService: SessionService,
    private userService: UserService
  ) {
    this.sessionService.online().subscribe((data: any) => {});
  }
  ngOnInit(): void {
    this.userService.setTheme();
  }
}
