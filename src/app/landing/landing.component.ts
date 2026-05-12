import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  services = [
    { icon: 'bi-person-plus', title: 'Open Account', desc: 'Start your journey with us in minutes. Zero balance accounts available.' },
    { icon: 'bi-cash-stack', title: 'Apply for Loans', desc: 'Get personal, home, and auto loans at competitive interest rates.' },
    { icon: 'bi-credit-card', title: 'Credit/Debit Cards', desc: 'Unlock amazing rewards and cashback with our premium cards.' },
    { icon: 'bi-arrow-left-right', title: 'View Transactions', desc: 'Track your expenses and manage your money efficiently.' }
  ];
}
