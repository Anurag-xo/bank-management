import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { User } from '../models/models';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  phone = '';
  address = '';
  password = '';
  role: 'customer' | 'employee' = 'customer';
  errorVisible = false;
  successMessage = '';
  generatedUsername = '';

  constructor(private router: Router, private auth: AuthService) {}

  onSubmit(): void {
    const newUser: any = {
      role: this.role,
      password: this.password,
      name: this.name,
      email: this.email,
      phone: this.phone,
      address: this.address
    };

    if (this.role === 'customer') {
      newUser.balance = 0;
      newUser.cibil = Math.floor(Math.random() * (850 - 300 + 1)) + 300;
      newUser.status = 'active';
    }

    this.auth.register(newUser).subscribe({
      next: (savedUser) => {
        this.generatedUsername = savedUser.username;
        this.successMessage = 'Success';
      },
      error: () => {
        this.errorVisible = true;
      }
    });
  }
}
