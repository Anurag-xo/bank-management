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
  
  // Validation error states
  nameError = '';
  emailError = '';
  phoneError = '';
  addressError = '';
  passwordError = '';
  errorMessage = '';
  errorVisible = false;
  successMessage = '';
  generatedUsername = '';

  constructor(private router: Router, private auth: AuthService) {}

  validateName(): boolean {
    const trimmed = this.name.trim();
    if (!trimmed) {
      this.nameError = 'Full Name is required.';
      return false;
    }
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!nameRegex.test(trimmed)) {
      this.nameError = 'Name must be 2-50 characters and contain only letters and spaces.';
      return false;
    }
    this.nameError = '';
    return true;
  }

  validateEmail(): boolean {
    const trimmed = this.email.trim();
    if (!trimmed) {
      this.emailError = 'Email address is required.';
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      this.emailError = 'Please enter a valid email address.';
      return false;
    }
    this.emailError = '';
    return true;
  }

  validatePhone(): boolean {
    const trimmed = this.phone.trim();
    if (!trimmed) {
      this.phoneError = 'Phone number is required.';
      return false;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(trimmed)) {
      this.phoneError = 'Phone number must be exactly 10 digits.';
      return false;
    }
    this.phoneError = '';
    return true;
  }

  validateAddress(): boolean {
    const trimmed = this.address.trim();
    if (!trimmed) {
      this.addressError = 'Address is required.';
      return false;
    }
    if (trimmed.length < 5) {
      this.addressError = 'Address must be at least 5 characters.';
      return false;
    }
    this.addressError = '';
    return true;
  }

  validatePassword(): boolean {
    const pwd = this.password;
    if (!pwd) {
      this.passwordError = 'Password is required.';
      return false;
    }
    if (pwd.length < 8) {
      this.passwordError = 'Password must be at least 8 characters long.';
      return false;
    }
    if (!/[A-Z]/.test(pwd)) {
      this.passwordError = 'Password must contain at least one uppercase letter.';
      return false;
    }
    if (!/[a-z]/.test(pwd)) {
      this.passwordError = 'Password must contain at least one lowercase letter.';
      return false;
    }
    if (!/[0-9]/.test(pwd)) {
      this.passwordError = 'Password must contain at least one number.';
      return false;
    }
    if (!/[!@#$%^&*()_+\-=\[\]\{\};':",.\/<>?~`]/.test(pwd)) {
      this.passwordError = 'Password must contain at least one special character.';
      return false;
    }
    this.passwordError = '';
    return true;
  }

  onSubmit(): void {
    this.errorVisible = false;
    this.errorMessage = '';

    const isNameValid = this.validateName();
    const isEmailValid = this.validateEmail();
    const isPhoneValid = this.validatePhone();
    const isAddressValid = this.validateAddress();
    const isPasswordValid = this.validatePassword();

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isAddressValid || !isPasswordValid) {
      this.errorVisible = true;
      this.errorMessage = 'Please fix the validation errors below.';
      return;
    }

    const newUser: any = {
      role: 'customer',
      password: this.password,
      name: this.name.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      address: this.address.trim()
    };

    newUser.balance = 0;
    newUser.cibil = Math.floor(Math.random() * (850 - 300 + 1)) + 300;
    newUser.status = 'active';

    this.auth.register(newUser).subscribe({
      next: (savedUser) => {
        this.generatedUsername = savedUser.username;
        this.successMessage = 'Success';
      },
      error: (err) => {
        this.errorVisible = true;
        this.errorMessage = err.error || 'Registration failed. Please try again.';
      }
    });
  }
}
