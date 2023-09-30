import { Component } from '@angular/core';
import { ConvService } from 'src/app/Services/conv.service';

@Component({
  selector: 'app-header-conv',
  templateUrl: './header-conv.component.html',
  styleUrls: ['./header-conv.component.css'],
})
export class HeaderConvComponent {
  name: string = '';
  photo: string = '';
  me: any;
  conv = JSON.parse(localStorage.getItem('conv') || '{}');
  constructor(private convService: ConvService) {
    //subscribe to change the conversation event
    this.convService.getConvInfosChanged().subscribe((conv: any) => {
      this.conv = conv;
      this.fillInfo();
      console.log('conv changed', conv);
    });
    //first filling
    this.fillInfo();
    this.convService.getConvChanged().subscribe((conv: any) => {
      this.conv = conv;
      this.fillInfo();
    });
  }

  fillInfo() {
    this.name = this.conv.name;
    this.photo = this.conv.photo;
  }
}
