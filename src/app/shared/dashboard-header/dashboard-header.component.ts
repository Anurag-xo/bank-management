import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})
export class DashboardHeaderComponent implements OnInit {
  showNotifications = false;
  notifications = [
    { title: 'Loan Approved', text: 'Your home loan application has been approved!', time: '2h ago', unread: true },
    { title: 'Security Alert', text: 'New login detected from a new device.', time: '5h ago', unread: false }
  ];

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  get userName(): string {
    return this.auth.getCurrentUser()?.name || 'User';
  }

  get userUsername(): string {
    return this.auth.getCurrentUser()?.username || '';
  }

  get userRole(): string {
    return this.auth.getCurrentUser()?.role || '';
  }

  get unreadCount(): number {
    return this.notifications.filter(n => n.unread).length;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (!this.showNotifications) {
      this.notifications.forEach(n => n.unread = false);
    }
  }

  logout(): void {
    this.auth.logout();
  }
}
