import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent, SidebarItem } from '../../shared/sidebar/sidebar.component';
import { DashboardHeaderComponent } from '../../shared/dashboard-header/dashboard-header.component';
import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../services/api.service';
import { User, Loan } from '../../models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, DashboardHeaderComponent, ToastComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeSection = 'dashboard';
  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', icon: 'bi-grid-1x2-fill', action: 'dashboard' },
    { label: 'Manage Employees', icon: 'bi-person-badge', action: 'employees' },
    { label: 'Manage Customers', icon: 'bi-people-fill', action: 'customers' },
    { label: 'Loan Approvals', icon: 'bi-cash-stack', action: 'loans' },
    { label: 'Audit Logs', icon: 'bi-shield-check', action: 'audit-logs' }
  ];

  customersCount = 0;
  employeesCount = 0;
  pendingLoansCount = 0;

  users: User[] = [];
  loans: Loan[] = [];
  auditLogs: any[] = [
    { id: 1, action: 'Loan Approved', performedBy: 'manager', timestamp: new Date(), details: 'Approved Home Loan of ₹500,000 for CUST123' },
    { id: 2, action: 'New Employee Created', performedBy: 'manager', timestamp: new Date(), details: 'Created account for new employee' }
  ];
  filteredUsers: User[] = [];
  filterRole: 'employee' | 'customer' = 'customer';
  searchQuery = '';
  showAddForm = false;

  addName = ''; addEmail = ''; addPhone = ''; addAddress = ''; addPassword = '';

  viewUser: User | null = null;
  viewLoan: Loan | null = null;
  showViewUserModal = false;
  showViewLoanModal = false;
  showConfirmModal = false;
  confirmMessage = '';
  pendingAction: (() => void) | null = null;
  userTransactions: any[] = [];
  currentUser: User | null = null;

  constructor(private auth: AuthService, private api: ApiService, private toast: ToastService) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser();
    this.auth.refreshCurrentUser().subscribe(user => {
      if (user) this.currentUser = user;
    });
    this.loadAll();
  }

  loadAll(): void {
    this.api.getAllUsers().subscribe(users => {
      this.users = users;
      this.customersCount = this.users.filter(u => u.role === 'customer').length;
      this.employeesCount = this.users.filter(u => u.role === 'employee').length;
      this.applyFilter();
    });

    this.api.getAllLoans().subscribe(loans => {
      this.loans = loans;
      this.pendingLoansCount = this.loans.filter(l => l.verificationStatus === 'PENDING_MANAGER').length;
    });
  }

  switchSection(section: string): void {
    this.activeSection = section;
    if (section === 'employees') this.filterRole = 'employee';
    if (section === 'customers') this.filterRole = 'customer';
    this.applyFilter();
  }

  applyFilter(): void {
    let list = this.users.filter(u => u.role === this.filterRole);
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q));
    }
    this.filteredUsers = list;
  }

  toggleAddForm(): void { this.showAddForm = !this.showAddForm; }

  addUser(): void {
    const newUser: any = {
      role: this.filterRole, password: this.addPassword,
      name: this.addName, email: this.addEmail, phone: this.addPhone, address: this.addAddress
    };
    
    if (this.filterRole === 'customer') {
      newUser.balance = 0;
      newUser.cibil = Math.floor(Math.random() * 551) + 300;
      newUser.status = 'active';
    }
    
    this.auth.register(newUser).subscribe({
      next: (user: any) => {
        this.toast.success(`${this.filterRole} created! ID: ${user.username}`);
        this.addName = ''; this.addPassword = ''; this.addEmail = ''; this.addPhone = ''; this.addAddress = '';
        this.showAddForm = false;
        this.loadAll();
      },
      error: () => this.toast.error('Failed to create user')
    });
  }

  deleteUser(username: string): void {
    this.confirmMessage = `Are you sure you want to permanently delete user ${username}?`;
    this.pendingAction = () => {
      this.api.deleteUser(username).subscribe({
        next: () => {
          this.toast.success(`User ${username} deleted`);
          this.loadAll();
        },
        error: () => this.toast.error('Failed to delete user')
      });
    };
    this.showConfirmModal = true;
  }

  toggleHoldUser(username: string, isHold: boolean): void {
    const actionStr = isHold ? 'hold' : 'unhold';
    this.confirmMessage = `Are you sure you want to ${actionStr} user ${username}?`;
    this.pendingAction = () => {
      this.api.holdUser(username, isHold).subscribe({
        next: () => {
          this.toast.success(`User ${username} status updated`);
          this.loadAll();
        },
        error: () => this.toast.error(`Failed to update user status`)
      });
    };
    this.showConfirmModal = true;
  }

  executeConfirm(): void {
    if (this.pendingAction) this.pendingAction();
    this.showConfirmModal = false;
    this.pendingAction = null;
  }

  openViewUser(username: string): void {
    this.viewUser = this.users.find(u => u.username === username) || null;
    if (this.viewUser && this.viewUser.role === 'customer') {
      this.api.getTransactionsByCustomer(username).subscribe(txs => {
        this.userTransactions = txs;
        this.showViewUserModal = true;
      });
    } else if (this.viewUser) {
      this.userTransactions = [];
      this.showViewUserModal = true;
    }
  }

  getUserLoans(username: string): Loan[] {
    return this.loans.filter(l => l.appliedBy === username);
  }

  updateLoanStatus(id: number, status: 'approved' | 'rejected'): void {
    const manager = this.auth.getCurrentUser()?.username || 'manager';
    this.api.updateLoanStatus(id, status, manager).subscribe(() => {
      this.api.updateLoanVerificationStatus(id, status.toUpperCase(), manager).subscribe(() => {
        this.toast.success(`Loan ${status}`);
        this.loadAll();
      });
    });
  }

  openViewLoan(id: number): void {
    this.viewLoan = this.loans.find(l => l.id === id) || null;
    this.showViewLoanModal = !!this.viewLoan;
  }

  getLoanInterest(loan: Loan): number { return loan.interest ? parseFloat(loan.interest) : 10.0; }
  getLoanTimeline(loan: Loan): number { return loan.timeline ? parseInt(loan.timeline) : 12; }
  getAccountNumber(id: number): string { return String(1000000000 + id); }
}
