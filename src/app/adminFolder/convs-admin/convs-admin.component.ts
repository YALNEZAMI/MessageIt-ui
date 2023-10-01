import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ConvService } from 'src/app/Services/conv.service';
import { Conv } from '../../Interfaces/conv.interface';
import { Router } from '@angular/router';
import { env } from '../../../env';
import { UserService } from 'src/app/Services/user.service';
@Component({
  selector: 'app-convs-admin',
  templateUrl: './convs-admin.component.html',
  styleUrls: ['./convs-admin.component.css'],
})
export class ConvsAdminComponent implements OnDestroy {
  convs: Conv[] = [];
  done = false;
  noRes = false;
  @ViewChild('lastMessage') lastMessage: ElementRef = new ElementRef('');
  constructor(
    private convService: ConvService,
    private router: Router,
    private userService: UserService
  ) {
    this.convService.getConvs().subscribe(async (data: any) => {
      let realData = await data;
      let key = localStorage.getItem('key');
      console.log(realData.length);

      if (realData.length == 0) {
        this.noRes = true;
      } else {
        this.noRes = false;
      }
      this.convs = realData;
      this.done = true;
    });
  }
  ngOnDestroy(): void {
    this.convs = [];
  }
  getLastMessageTextAndHour(conv: Conv) {
    if (conv.lastMessage != null) {
      let date = new Date(conv.lastMessage.date);
      let hour = date.getHours();
      if (hour < 10) hour = Number('0' + hour);
      let minutes = date.getMinutes();
      if (minutes < 10) minutes = Number('0' + minutes);
      return (
        conv.lastMessage.text.slice(0, 20) + '...' + ' ' + hour + ':' + minutes
      );
    } else {
      return '';
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

  getStatusClasses(conv: any) {
    return this.convService.getStatusClassesForConv(conv);
  }
}
