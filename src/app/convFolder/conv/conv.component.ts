import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConvService } from 'src/app/Services/conv.service';
import { SessionService } from 'src/app/Services/session.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-conv',
  templateUrl: './conv.component.html',
  styleUrls: ['./conv.component.css'],
})
export class ConvComponent implements OnInit {
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private convService: ConvService,
    private webSocketService: WebSocketService
  ) {
    this.sessionService.online().subscribe((data: any) => {});
    if (localStorage.getItem('conv') == null) {
      this.router.navigate(['admin/convs']);
    }
    //websocket of delete from groupe
    this.webSocketService
      .onRemoveFromGroupe()
      .subscribe((object: { idUser: string; idConv: string }) => {
        //if the current user is removed from the current conv
        if (
          object.idUser == this.getThisUser()._id &&
          object.idConv == this.getThisConv()._id
        ) {
          //remove the conv from the local storage
          localStorage.removeItem('conv');
          //navigate to convs
          this.router.navigate(['admin/convs']);
        }
      });
  }
  getThisUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
  getThisConv() {
    return JSON.parse(localStorage.getItem('conv') || '{}');
  }
  ngOnInit(): void {
    this.convService.setTheme();
  }
  returnToConvs() {
    localStorage.removeItem('conv');
    this.router.navigate(['admin/convs']);
  }
}
