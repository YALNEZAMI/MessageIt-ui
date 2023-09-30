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

      if (realData.length == 0) {
        this.noRes = true;
      }
      // console.log(this.convs);
      // let double = realData.concat(realData);
      // let double2 = double.concat(double);
      // this.convs = double2.concat(double2);
      this.convs = realData;
      this.done = true;
    });
  }
  ngOnDestroy(): void {
    this.convs = [];
  }
  getLastMessageText(conv: Conv) {
    if (conv.lastMessage != null) {
      return conv.lastMessage.text.slice(0, 20) + '...';
    } else {
      return '';
    }
  }
  // ngAfterViewInit(): void {
  //   let myTest: HTMLElement = this.lastMessage.nativeElement;
  //   console.log(myTest);
  // }
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
