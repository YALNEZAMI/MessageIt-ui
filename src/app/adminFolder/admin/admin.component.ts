import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/Services/message.service';
import { SessionService } from 'src/app/Services/session.service';
import { SideBarService } from 'src/app/Services/side-bar.service';
import { UserService } from 'src/app/Services/user.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';
import env from 'src/env';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  displayingSideBar = false;

  constructor(
    private sessionService: SessionService,
    private userService: UserService,
    private webSocketService: WebSocketService,
    private messageService: MessageService,
    private sideBarService: SideBarService
  ) {
    if (!this.sessionService.isAuthenticated()) {
      this.sessionService.logout();
    }
    //status check interval
    setInterval(() => {
      if (this.sessionService.isAuthenticated()) {
        this.sessionService.online().subscribe((data: any) => {});
      } else {
        this.sessionService.logout();
      }
    }, 1000 * 60 * env.CHECK_USER_STATUS_INTERVAL_TIME_MIN);
    this.webSocketService.newMessage().subscribe((message: any) => {
      //set current user as reciever
      this.messageService.setReciever(message._id).subscribe((data: any) => {});
    });
    //friend subscription
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
    this.webSocketService.upgradingToAdmin().subscribe((conv: any) => {});
    //subscribe to upgrade to chef
    this.webSocketService.upgardingToChef().subscribe((conv: any) => {});
    //subscribe to upgrade
    this.webSocketService.downgardingToAdmin().subscribe((conv: any) => {});
    this.webSocketService.onReaction().subscribe((reaction: any) => {});
    this.webSocketService.onRecievedMessage().subscribe((message: any) => {});
    this.webSocketService.setVus().subscribe((message: any) => {});
    this.webSocketService.statusChange().subscribe((user: any) => {});
    this.webSocketService.onSomeUserUpdated().subscribe((user: any) => {});
    //side bar
    this.sideBarService.getSideBarVisible().subscribe((bool: boolean) => {
      this.displayingSideBar = bool;
    });
  }
  ngOnInit(): void {
    this.userService.setTheme();
  }
  toggleSidebar() {
    this.displayingSideBar = !this.displayingSideBar;
  }
}
