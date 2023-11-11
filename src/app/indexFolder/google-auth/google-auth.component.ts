import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/Services/session.service';
import { ConvService } from 'src/app/Services/conv.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-google-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-auth.component.html',
  styleUrl: './google-auth.component.css',
})
export class GoogleAuthComponent {
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private convService: ConvService,
    private userService: UserService
  ) {
    let route = this.router.url.split('=');
    let id = route[route.length - 1];

    this.userService.findForGoogle(id).subscribe((user: any) => {
      this.sessionService.setToken(user._id);
      this.sessionService.setThisUser(user);
      this.convService.getConvs().subscribe(async (convs: any) => {
        //set convs in local storage
        this.sessionService.setThisConvs(convs);
        this.router.navigate(['admin/convs']);
      });
    });
  }
}
