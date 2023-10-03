import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/Services/session.service';
import { env } from 'src/env';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  constructor(private sessionService: SessionService) {}
  ngOnInit(): void {
    // this.sessionService.online().subscribe((data: any) => {});
  }
}
