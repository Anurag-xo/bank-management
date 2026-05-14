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

  addName = ''; addPassword = ''; addEmail = ''; addPhone = ''; addAddress = ''; addAadhar = ''; addPan = '';
  viewUser: User | null = null;
  showViewUserModal = false;
  viewLoan: Loan | null = null;
  showViewLoanModal = false;
  currentUser: User | null = null;

  txId = ''; txSsn = ''; txName = ''; txAmount: number | null = null; txType = 'Deposit'; txToAcc = ''; txIfsc = '';

  loanCustUsername = ''; loanAmount: number | null = null; loanType = 'Home'; loanBasis = 'CIBIL'; collateralDetails = ''; loanEmiMonths = 12;
  uploadedFileName = '';

  allTransactions: Transaction[] = [];
  loans: Loan[] = [];
  profileUpdates: ProfileUpdate[] = [];

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
      this.pendingLoans = this.loans.filter(l => l.verificationStatus === 'PENDING_EMPLOYEE').length;
    });

    this.api.getProfileUpdates().subscribe(updates => {
      this.profileUpdates = updates;
      this.pendingProfileUpdates = this.profileUpdates.filter(p => p.status === 'pending').length;
    });
  }

  switchSection(section: string): void { this.activeSection = section; this.loadAll(); }

  applySearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredCustomers = q ? this.customers.filter(c => c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q)) : [...this.customers];
  }

  addCustomer(): void {
    if (!this.addName || !this.addPassword || !this.addAadhar || !this.addPan) { this.toast.error('Fill all required fields!'); return; }
    
    const newUser: any = { role: 'customer', password: this.addPassword, name: this.addName, email: this.addEmail, phone: this.addPhone, address: this.addAddress, aadharCard: this.addAadhar, panCard: this.addPan, balance: 0, cibil: Math.floor(Math.random() * 551) + 300, status: 'active' };
    
    this.auth.register(newUser).subscribe({
      next: (user: any) => {
        this.toast.success(`Customer created! Username: ${user.username}`);
        this.addName = ''; this.addPassword = ''; this.addEmail = ''; this.addPhone = ''; this.addAddress = ''; this.addAadhar = ''; this.addPan = '';
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

  openViewLoan(id: number): void {
    this.viewLoan = this.loans.find(l => l.id === id) || null;
    this.showViewLoanModal = !!this.viewLoan;
  }

  processTransaction(): void {
    if (!this.txSsn || !this.txName || !this.txAmount || this.txAmount <= 0) { this.toast.error('Fill all transaction fields!'); return; }
    
    const emp = this.auth.getCurrentUser();
    const tx = {
      customerUsername: emp?.username || 'employee',
      recipientUsername: this.txSsn,
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
    if (!this.loanCustUsername || !this.loanAmount || this.loanAmount <= 0) { this.toast.error('Fill all required loan fields!'); return; }
    const emp = this.auth.getCurrentUser();
    
    const loan = {
      customerUsername: this.loanCustUsername,
      amount: this.loanAmount,
      type: this.loanType,
      loanBasis: this.loanBasis,
      collateralDetails: this.loanBasis === 'Collateral' ? this.collateralDetails : null,
      emiMonths: this.loanBasis === 'Collateral' ? this.loanEmiMonths : null,
      emiAmount: this.loanBasis === 'Collateral' ? (this.loanAmount / this.loanEmiMonths) * 1.1 : null,
      verificationStatus: 'PENDING_MANAGER',
      status: 'pending',
      appliedBy: emp?.username || 'employee'
    };

    this.api.applyLoan(loan).subscribe({
      next: () => {
        this.toast.success('Loan application submitted to Manager!');
        this.loanCustUsername = ''; this.loanAmount = null; this.collateralDetails = ''; this.uploadedFileName = '';
        this.loadAll();
      },
      error: () => this.toast.error('Failed to apply for loan')
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFileName = file.name;
    }
  }

  verifyLoan(id: number): void {
    const emp = this.auth.getCurrentUser();
    this.api.updateLoanVerificationStatus(id, 'PENDING_MANAGER', emp?.username || 'employee').subscribe(() => {
      this.toast.success('Loan verified and forwarded to Manager');
      this.loadAll();
    });
  }

  approveProfile(id: number): void {
    const emp = this.auth.getCurrentUser();
    this.api.updateProfileStatus(id, 'approved', emp?.username || 'employee').subscribe(() => {
      this.toast.success('Profile update approved');
      this.loadAll();
    });
  }

  rejectProfile(id: number): void {
    const emp = this.auth.getCurrentUser();
    this.api.updateProfileStatus(id, 'rejected', emp?.username || 'employee').subscribe(() => {
      this.toast.success('Profile update rejected');
      this.loadAll();
    });
  }

  getAccountNumber(id: number): string { return String(1000000000 + id); }
}
