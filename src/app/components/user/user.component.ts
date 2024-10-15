import { Component, Input } from '@angular/core';
import { User } from 'src/app/Interfaces/User.interface';
import { FriendService } from 'src/app/Services/friend.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-user',

  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  @Input() user: User | any;
  constructor(
    private userService: UserService,
    private friendService: FriendService
  ) {}
  getStatusClasses(user: User) {
    return this.userService.getStatusClassesForUser(user);
  }
  async friendOperation(body: any) {
    await this.friendService.friendOperations(body);
    switch (this.user.operation) {
      case 'cancel':
      case 'refuse':
      case 'remove':
        this.user.operation = 'add';
        break;
      case 'add':
        this.user.operation = 'cancel';
        break;
      case 'accept':
        this.user.operation = 'remove';
        break;

      default:
        break;
    }
  }
  getBtnContent(user: User): void {
    let btn = document.getElementById(user._id + '-Btn1');
    if (btn != null) {
      btn.innerHTML = this.friendService.getBtnContent(user);
    }
  }
}
