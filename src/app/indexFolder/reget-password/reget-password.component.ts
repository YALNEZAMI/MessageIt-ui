import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MailerService } from 'src/app/Services/mailer.service';

@Component({
  selector: 'app-reget-password',
  templateUrl: './reget-password.component.html',
  styleUrls: ['./reget-password.component.css'],
})
export class RegetPasswordComponent {
  //loading to have the spinner on getting the code
  loading = false;
  //server response
  response = {
    status: 0,
    message: '',
  };
  //the data sent to the server
  data = {
    email: '',
  };
  //html element of the email input
  @ViewChild('emailInput') emailInput: ElementRef = new ElementRef('');
  constructor(private mailerService: MailerService, private router: Router) {}

  getCode() {
    if (this.data.email == '' || !this.data.email.includes('@')) {
      this.emailInput.nativeElement.classList.add('alert');
      this.emailInput.nativeElement.classList.add('alert-danger');
      return;
    }
    localStorage.setItem('email', this.data.email);
    this.loading = true;
    this.mailerService.getCode(this.data).subscribe((res: any) => {
      if (res.status == 404) {
        this.response = res;
        this.loading = false;
      } else {
        this.router.navigate(['/auth/resetPassword']);
      }
    });
  }
}
