import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent, SidebarItem } from '../../shared/sidebar/sidebar.component';
import { DashboardHeaderComponent } from '../../shared/dashboard-header/dashboard-header.component';
import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../services/api.service';
import { User, Loan, ProfileUpdate, Transaction } from '../../models/models';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, DashboardHeaderComponent, ToastComponent],
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  activeSection = 'dashboard';
  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', icon: 'bi-grid-1x2-fill', action: 'dashboard' },
    { label: 'Customers', icon: 'bi-people-fill', action: 'customers' },
    { label: 'Add Customer', icon: 'bi-person-plus', action: 'add-customer' },
    { label: 'Transactions', icon: 'bi-arrow-left-right', action: 'transactions' },
    { label: 'Transaction History', icon: 'bi-clock-history', action: 'tx-history' },
    { label: 'Apply Loan', icon: 'bi-cash-stack', action: 'apply-loan' },
    { label: 'Loan Status', icon: 'bi-file-earmark-check', action: 'loan-status' },
    { label: 'Profile Updates', icon: 'bi-pencil-square', action: 'profile-updates' }
  ];

  totalCustomers = 0;
  totalTransactions = 0;
  pendingLoans = 0;
  pendingProfileUpdates = 0;

  customers: User[] = [];
  searchQuery = '';
  filteredCustomers: User[] = [];

  addName = ''; addPassword = ''; addEmail = ''; addPhone = ''; addAddress = '';
  viewUser: User | null = null;
  showViewUserModal = false;

  txId = ''; txSsn = ''; txName = ''; txAmount: number | null = null; txType = 'Deposit'; txToAcc = ''; txIfsc = '';

  loanCustId: number | null = null; loanAmount: number | null = null; loanType = 'Home'; loanInterest = '8.5'; loanTimeline = '12'; loanDocument = 'Aadhar';

  allTransactions: Transaction[] = [];
  loans: Loan[] = [];
  profileUpdates: ProfileUpdate[] = [];

  constructor(private auth: AuthService, private api: ApiService, private toast: ToastService) {}

  ngOnInit(): void { this.loadAll(); }

  loadAll(): void {
    this.api.getAllUsers().subscribe(users => {
      this.customers = users.filter(u => u.role === 'customer');
      this.totalCustomers = this.customers.length;
      this.applySearch();
    });

    this.api.getAllTransactions().subscribe(txs => {
      this.allTransactions = txs;
      this.totalTransactions = this.allTransactions.length;
    });

    this.api.getAllLoans().subscribe(loans => {
      this.loans = loans;
      this.pendingLoans = this.loans.filter(l => l.status === 'pending').length;
    });

    this.profileUpdates = JSON.parse(localStorage.getItem('profileUpdates') || '[]');
    this.pendingProfileUpdates = this.profileUpdates.filter(p => p.status === 'pending').length;
  }

  switchSection(section: string): void { this.activeSection = section; this.loadAll(); }

  applySearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredCustomers = q ? this.customers.filter(c => c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q)) : [...this.customers];
  }

  addCustomer(): void {
    if (!this.addName || !this.addPassword) { this.toast.error('Fill all required fields!'); return; }
    
    const newUser: any = { role: 'customer', password: this.addPassword, name: this.addName, email: this.addEmail, phone: this.addPhone, address: this.addAddress, balance: 0, cibil: Math.floor(Math.random() * 551) + 300, status: 'active' };
    
    this.auth.register(newUser).subscribe({
      next: (user: any) => {
        this.toast.success(`Customer created! ID: ${user.username}`);
        this.addName = ''; this.addPassword = ''; this.addEmail = ''; this.addPhone = ''; this.addAddress = '';
        this.loadAll();
        this.activeSection = 'customers';
      },
      error: () => this.toast.error('Failed to create customer')
    });
  }

  openViewCustomer(id: number): void {
    this.viewUser = this.customers.find(c => c.id === id) || null;
    this.showViewUserModal = !!this.viewUser;
  }

  processTransaction(): void {
    if (!this.txSsn || !this.txName || !this.txAmount || this.txAmount <= 0) { this.toast.error('Fill all transaction fields!'); return; }
    
    const tx = {
      customerId: parseInt(this.txSsn),
      amount: this.txAmount,
      type: this.txType,
      toAcc: this.txToAcc || undefined,
      ifsc: this.txIfsc || undefined
    };

    this.api.processTransaction(tx).subscribe({
      next: () => {
        this.toast.success(`${this.txType} of ₹${this.txAmount} processed!`);
        this.txSsn = ''; this.txName = ''; this.txAmount = null; this.txToAcc = ''; this.txIfsc = '';
        this.loadAll();
      },
      error: (err) => this.toast.error(err.error || 'Transaction failed')
    });
  }

  applyLoan(): void {
    if (!this.loanCustId || !this.loanAmount || this.loanAmount <= 0) { this.toast.error('Fill all required loan fields!'); return; }
    const emp = this.auth.getCurrentUser();
    
    const loan = {
      customerId: this.loanCustId,
      amount: this.loanAmount,
      type: this.loanType,
      interest: this.loanInterest,
      timeline: this.loanTimeline,
      document: this.loanDocument,
      status: 'pending',
      appliedBy: emp?.username || 'employee'
    };

    this.api.applyLoan(loan).subscribe({
      next: () => {
        this.toast.success('Loan application submitted!');
        this.loanCustId = null; this.loanAmount = null;
        this.loadAll();
      },
      error: () => this.toast.error('Failed to apply for loan')
    });
  }

  approveProfile(id: number): void {
    this.api.updateProfileStatus(id, 'approved').subscribe(() => {
      this.toast.success('Profile update approved');
      this.loadAll();
    });
  }

  rejectProfile(id: number): void {
    this.api.updateProfileStatus(id, 'rejected').subscribe(() => {
      this.toast.success('Profile update rejected');
      this.loadAll();
    });
  }

  getAccountNumber(id: number): string { return String(1000000000 + id); }
}
