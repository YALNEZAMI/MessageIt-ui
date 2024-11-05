import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { NavItem } from 'src/app/Interfaces/navItem.interface';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.css',
})
export class NavItemComponent implements AfterViewChecked {
  @Input() navItem: NavItem | any;
  constructor(private router: Router, private userService: UserService) {}
  ngAfterViewChecked(): void {
    document.getElementById(this.navItem._id + '-svgContainer')!.innerHTML =
      this.navItem.svg;
  }
  goTo(): void {
    this.navItem.counter = 0;
    this.router.navigate([this.navItem.route]);
  }
  isCurrentRoute(): boolean {
    return this.getFinalPath() === this.navItem.route;
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
    return res.split('?')[0];
  }
  getCounter() {
    if (this.navItem.counter <= 9) {
      return this.navItem.counter;
    }
    return '+9';
  }
  getThirdCommonColorClasses() {
    return this.userService.getThirdCommonColor();
  }
}
