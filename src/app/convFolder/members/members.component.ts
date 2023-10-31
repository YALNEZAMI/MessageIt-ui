import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConvService } from 'src/app/Services/conv.service';
import { FriendService } from 'src/app/Services/friend.service';
import { SessionService } from 'src/app/Services/session.service';
import { UserService } from 'src/app/Services/user.service';
import { WebSocketService } from 'src/app/Services/webSocket.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})
export class MembersComponent {
  //members of the conv
  members: any[] = [];
  //done=true to display the members else display a spinner
  done: boolean = false;

  constructor(
    private router: Router,
    private convService: ConvService,
    private friendService: FriendService,
    private userService: UserService,
    private webSocketService: WebSocketService,
    private sessionService: SessionService
  ) {
    //status change websocket subscription
    this.webSocketService.statusChange().subscribe((user: any) => {
      this.members.map((member: any) => {
        if (member._id == user._id) {
          member.status = user.status;
        }
      });
    });
    if (this.sessionService.thereAreMembers()) {
      //retrieve the members of the conv from local storage

      this.members = this.sessionService.getThisMembers();

      this.done = true;
    } else {
      //retrieve the members of the conv from database
      this.convService.getMembers().subscribe(async (data: any) => {
        this.members = await data;
        this.done = true;
      });
    }

    //subscribe to add member to groupe event
    this.webSocketService
      .onAddMemberToGroupe()
      .subscribe((convAndNewMembers: any) => {
        // if (convAndNewMembers.conv._id == this.getThisConv()._id) {
        //   this.members = convAndNewMembers.conv.members;
        //   this.noRes = false;
        // }
        if (this.sessionService.thereIsConv()) {
          this.members = this.sessionService.getThisMembers();
        }
      });
    //subscribe to remove member from groupe event
    this.webSocketService
      .onRemoveFromGroupe()
      .subscribe((obj: { idUser: string; conv: any }) => {
        // if (obj.conv._id == this.getThisConv()._id) {
        //   this.members = obj.conv.members;
        // }
        if (this.sessionService.thereIsConv()) {
          this.members = this.sessionService.getThisMembers();
        }
      });
    //subscribe to leave conv
    this.webSocketService
      .onLeavingConv()
      .subscribe((convAndLeaver: { conv: any; leaver: any }) => {
        // if (convAndLeaver.conv._id == this.getThisConv()._id) {
        //   this.members = convAndLeaver.conv.members;
        // }
        if (this.sessionService.thereIsConv()) {
          this.members = this.sessionService.getThisMembers();
        }
      });

    //subscribe to upgrade to admin
    this.webSocketService.upgradingToAdmin().subscribe((conv: any) => {
      //update conv
      this.members = this.sessionService.getThisMembers();
    });
    //subscribe to upgrade to chef
    this.webSocketService.upgardingToChef().subscribe((conv: any) => {
      //update conv
      this.members = this.sessionService.getThisMembers();
    });
    //subscribe to upgrade
    this.webSocketService.downgardingToAdmin().subscribe((conv: any) => {
      //update conv
      this.members = this.sessionService.getThisMembers();
    });
  }

  /**
   *
   * @returns true if there is some members expept the user in the conv
   */
  therIsSomeMembers() {
    for (let index = 0; index < this.members.length; index++) {
      const member = this.members[index];
      if (member != null && member._id != this.getThisUser()._id) {
        return true;
      }
    }
    return false;
  }
  /**
   *
   * @returns the members of the conv except the user
   */
  getThisMembers() {
    let user = this.getThisUser();
    let members = this.members;
    let res: any[] = [];
    for (let member of members) {
      if (member != null) {
        if (member._id != user._id) {
          res.push(member);
        }
      }
    }
    return res;
  }
  /**
   *
   * @param user
   * @returns delete the user from the conv
   */
  delete(user: any) {
    this.friendService.remove(user._id).subscribe((res) => {});
  }
  /**
   *
   * @returns the user from the local storage
   */
  getThisUser() {
    return this.sessionService.getThisUser();
  }
  /**
   *
   * @param userId
   * @param operation
   * @returns after clicking a button,
   * reset the operation(add,remove...)
   */
  setOperation(userId: string, operation: string) {
    for (let i = 0; i < this.members.length; i++) {
      const element = this.members[i];
      if (element._id == userId) {
        element.operation = operation;
      }
    }
  }
  /**
   *
   * @param user
   * @returns perform the operation(add,remove...) according to the user operation
   */
  async operation(user: any) {
    switch (user.operation) {
      case 'add':
        this.friendService.add(user._id).subscribe((data: any) => {
          this.setOperation(user._id, 'cancel');
        });
        break;
      case 'remove':
        this.friendService.remove(user._id).subscribe((data: any) => {
          this.setOperation(user._id, 'add');
        });
        break;
      case 'cancel':
        this.friendService.cancel(user._id).subscribe((data: any) => {
          this.setOperation(user._id, 'add');
        });
        break;
      case 'refuse':
        this.friendService.refuse(user._id).subscribe((data: any) => {
          this.setOperation(user._id, 'add');
        });
        break;
      case 'accept':
        this.friendService.accept(user._id).subscribe((data: any) => {
          this.setOperation(user._id, 'remove');
        });
        break;
      case 'chat':
        if (document.getElementById(user._id + '-ChatBtn') != null) {
          let chatBtn =
            document.getElementById(user._id + '-ChatBtn') ||
            document.createElement('button');
          chatBtn.innerHTML = `...`;
        }
        this.convService.createConv(user._id).subscribe((conv: any) => {
          try {
            localStorage.setItem('conv', JSON.stringify(conv));
            this.router.navigate(['/conv/messages']);
          } catch (error) {
            console.log(error);
          }
        });
        break;

      default:
        break;
    }
  }
  /**
   *
   * @param user
   * @returns the content(icon) of the button according to the user operation
   */
  getContenuBtn(user: any): void {
    const operation: string = user.operation;
    let btn: any;

    switch (operation) {
      case 'add':
        btn = document.getElementById(user._id + '-Btn1');
        if (btn != null) {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
          <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
          <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
        </svg>`;
        }

        break;
      case 'remove':
        btn = document.getElementById(user._id + '-Btn1');
        if (btn != null) {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-dash-fill" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/>
          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        </svg>`;
        }

        break;
      case 'cancel':
        btn = document.getElementById(user._id + '-Btn1');
        if (btn != null) {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
        </svg>`;
        }

        break;
      case 'accept':
        btn = document.getElementById(user._id + '-Btn1');
        if (btn != null) {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
          <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
          <path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
        </svg>`;
        }

        break;
    }
  }
  //get css classes according to the user status (online,offline...)
  getStatusClasses(user: any) {
    return this.userService.getStatusClassesForUser(user);
  }

  isAdmin(id: string) {
    let admins = this.sessionService.getThisConv().admins;
    if (!admins) {
      return false;
    } else {
      return admins.includes(id);
    }
  }
  isChef(id: string) {
    let chef = this.sessionService.getThisConv().chef;
    return chef == id;
  }
  options(user: any) {
    let div = document.getElementById(user._id + '-options');
    if (div != null) {
      if (div.style.display == 'block') {
        div.style.display = 'none';
      } else {
        div.style.display = 'block';
      }
    }
  }

  setThisConv(conv: any) {
    localStorage.setItem('conv', JSON.stringify(conv));
  }
  removeFromGroupe(user: any) {
    this.convService.removeFromGroupe(user._id).subscribe((conv: any) => {
      //update the conv in the local storage
      this.setThisConv(conv);
      //remove the user from the list
      document.getElementById(user._id)?.remove();
    });
  }
  isGroupe() {
    return this.sessionService.getThisConv().type == 'groupe';
  }
  goToAddMembers() {
    this.router.navigate(['/conv/addMembers']);
  }
  upgradeToAdmin(user: any) {
    this.convService.upgradeToAdmine(user).subscribe((conv: any) => {});
  }
  downgradeToAdmin(user: any) {
    this.convService.downgradeToAdmin(user).subscribe((conv: any) => {});
  }
  upgradeToChef(user: any) {
    this.convService.upgradeToChef(user).subscribe((conv: any) => {});
  }
  getNoRes() {
    return this.members.length == 1;
  }
}
