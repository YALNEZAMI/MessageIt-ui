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

@Component({
  selector: 'app-convs-admin',
  templateUrl: './convs-admin.component.html',
  styleUrls: ['./convs-admin.component.css'],
})
export class ConvsAdminComponent implements OnDestroy {
  convs: Conv[] = [];
  done = false;
  noRes = false;
  me = JSON.parse(localStorage.getItem('user') || '{}');
  @ViewChild('lastMessage') lastMessage: ElementRef = new ElementRef('');
  constructor(private convService: ConvService, private router: Router) {
    this.convService.getConvs().subscribe(async (data: any) => {
      let realData = await data;

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
  getLastMessageHour(conv: Conv) {
    if (conv.lastMessage != null) {
      let date = new Date(conv.lastMessage.date);
      let hour = date.getHours();
      if (hour < 10) hour = Number('0' + hour);
      let minutes = date.getMinutes();
      if (minutes < 10) minutes = Number('0' + minutes);
      return hour + ':' + minutes;
    } else {
      return '';
    }
  }
  getLastMessageText(conv: Conv) {
    if (conv.lastMessage != null) {
      return conv.lastMessage.text.slice(0, 20) + '...';
    } else {
      return '';
    }
  }
  toLocalString(dateString: any) {
    let date = new Date(dateString);
    return date.toLocaleString();
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

  getOtherMember(conv: any) {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    if (conv.members[0]._id == user._id) {
      return conv.members[1];
    } else {
      return conv.members[0];
    }
  }
}
