import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Interfaces/User.interface';
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
  currentOptions: HTMLElement = document.createElement('div');
  //members of the conv
  members: any[] = [];
  //done=true to display the members else display a spinner
  done: boolean = false;
  user: any = {};
  isOperating = false;

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

    //retrieve the members of the conv from database
    this.convService.getMembers().subscribe(async (data: any) => {
      this.members = await data;
      this.done = true;
    });

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
    return this.members.filter((member) => {
      return member._id != user._id;
    });
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
    this.members = this.members.map((member) => {
      if (member._id == userId) {
        member.operation = operation;
      }
      return member;
    });
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
  options(user: User) {
    this.isOperating = true;

    this.user = user;
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
  downgradeFromAdmin(user: any) {
    this.convService.downgradeFromAdmin(user).subscribe((conv: any) => {});
  }
  upgradeToChef(user: any) {
    this.convService.upgradeToChef(user).subscribe((conv: any) => {});
  }
  getNoRes() {
    return this.members.length == 1;
  }
}
