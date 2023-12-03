import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConvService } from 'src/app/Services/conv.service';
import { SessionService } from 'src/app/Services/session.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';
import { env } from 'src/env';

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
    //not authenticated case
    if (!this.sessionService.isAuthenticated()) {
      this.sessionService.logout();
    }
    //there is no conv in localstorage
    if (this.sessionService.thereIsConv()) {
      this.router.navigate(['admin/convs']);
    }
    //status check interval
    setInterval(() => {
      if (this.sessionService.isAuthenticated()) {
        this.sessionService.online().subscribe((data: any) => {});
      }
    }, 1000 * 60 * env.CHECK_USER_STATUS_INTERVAL_TIME_MIN);
    //set last message of conv as seen in local storage convs
    this.sessionService.setLastMessageAsSeen();

    //websocket of delete from groupe
    this.webSocketService
      .onRemoveFromGroupe()
      .subscribe((object: { idUser: string; conv: any }) => {
        //if the current user is removed from the current conv
        if (
          object.idUser == this.sessionService.getThisUser()._id &&
          object.conv._id == this.sessionService.getThisConv()._id
        ) {
          //remove the conv from the local storage
          localStorage.removeItem('conv');
          //navigate to convs
          this.router.navigate(['admin/convs']);
        }
      });
    //subscribe to leaving the conv event
    this.webSocketService.onLeavingConv().subscribe((conv: any) => {
      if (conv._id == this.sessionService.getThisConv()._id) {
        this.sessionService.setThisConv(conv);
      }
    });
    //web socket subscription
    this.webSocketService.onAcceptFriend().subscribe((data: any) => {});
    this.webSocketService.onRemoveFriend().subscribe((data: any) => {});
    this.webSocketService.onAddFriend().subscribe((data: any) => {});
    this.webSocketService.onCancelFriend().subscribe((data: any) => {});
    //conv subscriptions
    this.webSocketService.onCreateConv().subscribe((conv: any) => {});
    this.webSocketService.onLeavingConv().subscribe((conv: any) => {});
    this.webSocketService.onRemoveFromGroupe().subscribe((data: any) => {});
    this.webSocketService.onAddMemberToGroupe().subscribe((data: any) => {});
    this.webSocketService.someConvChanged().subscribe((conv: any) => {});
    //subscribe to upgrade to admin
    this.webSocketService.upgradingToAdmin().subscribe((conv: any) => {});
    //subscribe to upgrade to chef
    this.webSocketService.upgardingToChef().subscribe((conv: any) => {});
    //subscribe to upgrade
    this.webSocketService.downgardingToAdmin().subscribe((conv: any) => {});
    //subscribe to delete message
    this.webSocketService.messageDeleted().subscribe((obj: any) => {});
    this.webSocketService.onReaction().subscribe((reaction: any) => {});
    this.webSocketService.onRecievedMessage().subscribe((message: any) => {});
    this.webSocketService.setVus().subscribe((message: any) => {});
    this.webSocketService.newMessage().subscribe((message: any) => {});
    this.webSocketService.statusChange().subscribe((user: any) => {});
    this.webSocketService.onSomeUserUpdated().subscribe((user: any) => {});
  }

  ngOnInit(): void {
    this.convService.setTheme();
  }
  returnToConvs() {
    this.sessionService.removeConvFromLocalStorage();
    this.router.navigate(['admin/convs']);
  }
  isMessagesRoute() {
    let url = this.router.url;
    let splitted = url.split('/');

    if (
      splitted[splitted.length - 2] == 'conv' &&
      splitted[splitted.length - 1] == 'messages'
    ) {
      return true;
    } else {
      return false;
    }
  }
}
