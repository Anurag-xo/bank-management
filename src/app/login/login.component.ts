import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorVisible = false;

  constructor(private auth: AuthService, private router: Router) {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.router.navigate([`/${user.role}`]);
    }
  }

  onSubmit(): void {
    this.auth.login(this.username, this.password).subscribe(user => {
      if (user) {
        this.router.navigate([`/${user.role}`]);
      } else {
        this.errorVisible = true;
      }
    });
  }
}
