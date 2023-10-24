import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConvService } from '../../Services/conv.service';
import { env } from '../../../env';
import { UserService } from 'src/app/Services/user.service';
import { Conv } from 'src/app/Interfaces/conv.interface';
import { Router } from '@angular/router';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-result-convs',
  templateUrl: './result-convs.component.html',
  styleUrls: ['./result-convs.component.css'],
})
export class ResultConvsComponent {
  convs: any[] = [];
  noRes = false;
  key: string = '';
  done: boolean = true;
  constructor(
    private convService: ConvService,
    private userService: UserService,
    private router: Router,
    private webSocketService: WebSocketService
  ) {
    //statusChange websocket subscription
    this.webSocketService.statusChange().subscribe((user: any) => {
      this.convs.map((conv: any) => {
        conv.members.map((member: any) => {
          if (member._id == user._id) {
            member.status = user.status;
          }
        });
      });
    });
    this.firstSearch();
    this.userService.getKey().subscribe(async (key: any) => {
      this.convs = [];
      if (key == '') {
        this.done = true;
        this.noRes = false;
        this.convs = [];
      } else {
        this.done = false;
        this.key = await key;
        this.convService
          .getConvsSearched(this.key)
          .subscribe(async (convs: any) => {
            let realData = await convs;

            // for (let index = 0; index < realData.length; index++) {
            //   const element = realData[index];
            //   element.photo = this.userService.setPhotoLinkForHtml(
            //     element.photo
            //   );
            // }

            this.convs = realData;
            if (this.convs.length == 0) {
              this.noRes = true;
            }
            this.done = true;
          });
      }
    });
  }
  ngOnInit(): void {}
  firstSearch() {
    this.key = localStorage.getItem('key') || '';
    if (this.key.trim() != '') {
      this.done = false;
      this.convService
        .getConvsSearched(this.key)
        .subscribe(async (convs: any) => {
          let realData = await convs;

          // for (let index = 0; index < realData.length; index++) {
          //   const element = realData[index];
          //   element.photo = this.userService.setPhotoLinkForHtml(element.photo);
          // }

          this.convs = realData;
          if (this.convs.length == 0) {
            this.noRes = true;
          }
          this.done = true;
        });
    }
  }
  async goToConv(conv: Conv) {
    localStorage.setItem('conv', JSON.stringify(conv));
    this.router.navigate(['/conv/messages']);
  }
  options(conv: Conv) {
    localStorage.setItem('conv', JSON.stringify(conv));
    this.router.navigate(['/conv/settings']);
  }
}
