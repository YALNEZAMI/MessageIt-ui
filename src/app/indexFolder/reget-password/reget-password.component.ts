import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MailerService } from 'src/app/Services/mailer.service';

@Component({
  selector: 'app-reget-password',
  templateUrl: './reget-password.component.html',
  styleUrls: ['./reget-password.component.css'],
})
export class RegetPasswordComponent {
  response = {
    status: 0,
    message: '',
  };
  data = {
    email: '',
  };
  @ViewChild('emailInput') emailInput: ElementRef = new ElementRef('');
  constructor(private mailerService: MailerService, private router: Router) {}

  getCode() {
    if (this.data.email == '') {
      this.emailInput.nativeElement.classList.add('alert');
      this.emailInput.nativeElement.classList.add('alert-danger');
      return;
    }

    localStorage.setItem('email', this.data.email);
    this.mailerService.getCode(this.data).subscribe((res: any) => {
      if (res.staus == 404) {
        this.response = res;
      } else {
        this.router.navigate(['/auth/resetPassword']);
      }
    });
  }
}
