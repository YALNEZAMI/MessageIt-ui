import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/Services/message.service';
import { SessionService } from 'src/app/Services/session.service';
import { UserService } from 'src/app/Services/user.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  constructor(
    private sessionService: SessionService,
    private userService: UserService,
    private webSocketService: WebSocketService,
    private messageService: MessageService
  ) {
    if (localStorage.getItem('user') == null) {
      this.sessionService.logout();
    }
    this.sessionService.online().subscribe((data: any) => {});
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
    this.webSocketService.convChanged().subscribe((conv: any) => {});
    this.webSocketService.upgradingToAdmin().subscribe((conv: any) => {});
    //subscribe to upgrade to chef
    this.webSocketService.upgardingToChef().subscribe((conv: any) => {});
    //subscribe to upgrade
    this.webSocketService.downgardingToAdmin().subscribe((conv: any) => {});
  }
  ngOnInit(): void {
    this.userService.setTheme();
  }
}
