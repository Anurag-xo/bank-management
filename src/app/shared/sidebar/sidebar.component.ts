import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface SidebarItem {
  label: string;
  icon: string;
  action?: string;
  route?: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() items: SidebarItem[] = [];
  @Input() activeItem = '';
  @Output() itemClick = new EventEmitter<string>();

  constructor(private auth: AuthService) {}

  get userName(): string {
    return this.auth.getCurrentUser()?.name || 'User';
  }

  get userUsername(): string {
    return this.auth.getCurrentUser()?.username || '';
  }

  get userRole(): string {
    return this.auth.getCurrentUser()?.role || '';
  }

  onItemClick(action: string | undefined): void {
    if (action) {
      this.itemClick.emit(action);
    }
  }

  showNotifications = false;
  notifications = [
    { title: 'Loan Approved', text: 'Your home loan application has been approved!', time: '2h ago', unread: true },
    { title: 'Security Alert', text: 'New login detected from a new device.', time: '5h ago', unread: false }
  ];

  get unreadCount(): number {
    return this.notifications.filter(n => n.unread).length;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (!this.showNotifications) {
      this.notifications.forEach(n => n.unread = false);
    }
  }
}
