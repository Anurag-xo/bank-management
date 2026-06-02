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
  usernameError = '';
  passwordError = '';
  errorVisible = false;

  constructor(private auth: AuthService, private router: Router) {
    const user = this.auth.getCurrentUser();
    if (user) {
      this.router.navigate([`/${user.role}`]);
    }
  }

  validateUsername(): boolean {
    const trimmed = this.username.trim();
    if (!trimmed) {
      this.usernameError = 'Username is required.';
      return false;
    }
    this.usernameError = '';
    return true;
  }

  validatePassword(): boolean {
    if (!this.password) {
      this.passwordError = 'Password is required.';
      return false;
    }
    this.passwordError = '';
    return true;
  }

  onSubmit(): void {
    this.errorVisible = false;
    const isUserValid = this.validateUsername();
    const isPassValid = this.validatePassword();

    if (!isUserValid || !isPassValid) {
      return;
    }

    this.auth.login(this.username.trim(), this.password).subscribe(user => {
      if (user) {
        this.router.navigate([`/${user.role}`]);
      } else {
        this.errorVisible = true;
      }
    });
  }
}
