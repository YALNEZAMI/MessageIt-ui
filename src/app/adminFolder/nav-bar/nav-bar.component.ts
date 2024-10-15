import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FriendService } from 'src/app/Services/friend.service';
import { UserService } from 'src/app/Services/user.service';

import { SessionService } from 'src/app/Services/session.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';
import { NavItem } from 'src/app/Interfaces/navItem.interface';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  nbrNotifs = 0;
  navItems: NavItem[] = [
    {
      _id: 'convsInAdmin',
      name: 'Conversations',
      route: '/admin/convs',
      counterExist: false,
      svg: ` <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-chat-square-dots"
      viewBox="0 0 16 16"
    >
      <path
        d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
      />
      <path
        d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
      />
    </svg>`,
    },
    {
      _id: 'profileInAdmin',
      name: 'Profile',
      route: '/admin/profile',
      counterExist: false,
      svg: `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-person-fill-gear"
      viewBox="0 0 16 16"
    >
      <path
        d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Zm9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382l.045-.148ZM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"
      />
    </svg>`,
    },
    {
      _id: 'notifsInAdmin',
      name: 'Notifications',
      route: '/admin/notifs',
      counterExist: true,
      counter: this.getNbrNotifs(),
      svg: `  <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-bell"
      viewBox="0 0 16 16"
    >
      <path
        d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"
      />
    </svg>`,
    },
    {
      _id: 'searchInAdmin',
      name: 'Search',
      route: '/admin/search/users',
      counterExist: false,
      svg: `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-search"
      viewBox="0 0 16 16"
    >
      <path
        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
      />
    </svg>`,
    },
    {
      _id: 'friendsInAdmin',
      name: 'Friends',
      route: '/admin/friends',
      counterExist: false,
      svg: `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-people"
      viewBox="0 0 16 16"
    >
      <path
        d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
      />
    </svg>`,
    },
  ];
  constructor(
    private router: Router,
    private friendService: FriendService,
    private webSocketService: WebSocketService,
    private sessionService: SessionService,
    private userService: UserService
  ) {
    //getInitialNotifs from local storage
    if (this.sessionService.isAuthenticated()) {
      if (this.sessionService.therAreNotifs()) {
        this.nbrNotifs = this.sessionService.getThisNotifs().length;
      } else {
        //getInitialNotifs from server
        this.friendService.friendReqSentToMe().subscribe(async (data: any) => {
          this.nbrNotifs = await data.length;
          //set local storage
          this.sessionService.setThisNotifs(data);
        });
      }
      this.webSocketService.onAddFriend().subscribe((data: any) => {
        this.nbrNotifs = this.sessionService.getThisNotifs().length;
      });
      this.webSocketService.onCancelFriend().subscribe((data: any) => {
        this.nbrNotifs = this.sessionService.getThisNotifs().length;
      });

      //accept friend request event
      this.webSocketService.onAcceptFriend().subscribe((data: any) => {
        this.nbrNotifs = this.sessionService.getThisNotifs().length;
      });
    }
  }

  getCurrentUser() {
    return this.userService.getCurrentUser();
  }
  goTo(path: string): void {
    this.router.navigate([path]);
  }

  getFinalPath() {
    let url = this.router.url;
    let splitted = url.split('/');
    let res = '';
    splitted.map((p, i) => {
      if (p && i != 0) {
        res += '/' + p;
      }
    });

    return res;
    // switch (last2Routes) {
    //   case 'admin/convs':
    //     break;
    //   case 'admin/profile':
    //     break;
    //   case 'admin/notifs':
    //     break;
    //   case 'search/users':
    //     break;
    //   case 'search/convs':
    //     break;
    //     case 'admin/friends':
    //     break;

    //   default:
    //     break;
    // }
  }
  getNbrNotifs() {
    return this.sessionService.getThisNotifs().length;
  }
  getTailwindThemeClesses() {
    return this.userService.getTailwindThemeClasses();
  }
  getSelectorLeft() {
    switch (this.getFinalPath()) {
      case '/admin/convs':
        return '10%';
      case '/admin/profile':
        return '27%';
      case '/admin/notifs':
        return '45%';
      case '/admin/search':
        return '64%';
      case '/admin/search/users':
        return '64%';
      case '/admin/search/convs':
        return '64%';
      case '/admin/friends':
        return '82%';
      default:
        return '100%';
        break;
    }
  }
}
