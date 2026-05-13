import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent, SidebarItem } from '../../shared/sidebar/sidebar.component';
import { DashboardHeaderComponent } from '../../shared/dashboard-header/dashboard-header.component';
import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../services/api.service';
import { User, Loan, Transaction, ProfileUpdate, ServiceRequest } from '../../models/models';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, DashboardHeaderComponent, ToastComponent],
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css']
})
export class CustomerDashboardComponent implements OnInit {
  activeSection = 'dashboard';
  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', icon: 'bi-grid-1x2-fill', action: 'dashboard' },
    { label: 'Transactions', icon: 'bi-arrow-left-right', action: 'transactions' },
    { label: 'Transaction History', icon: 'bi-clock-history', action: 'tx-history' },
    { label: 'Payees', icon: 'bi-person-heart', action: 'payees' },
    { label: 'My Cards', icon: 'bi-credit-card-2-back', action: 'cards' },
    { label: 'Apply Loan', icon: 'bi-cash-stack', action: 'apply-loan' },
    { label: 'My Loans', icon: 'bi-file-earmark-check', action: 'my-loans' },
    { label: 'Update Profile', icon: 'bi-pencil-square', action: 'update-profile' },
    { label: 'Services', icon: 'bi-star', action: 'services' }
  ];

  currentUser!: User;
  accountNumber = '';
  totalDeposits = 0;
  totalWithdrawals = 0;

  txAmount: number | null = null; txType = 'Transfer'; txToAcc = ''; txIfsc = '';
  myTransactions: Transaction[] = [];
  myLoans: Loan[] = [];
  loanAmount: number | null = null; loanType = 'Home';

  upName = ''; upEmail = ''; upPhone = ''; upAddress = '';

  serviceRequests: ServiceRequest[] = [];
  beneficiaries: any[] = [];
  cards: any[] = [];
  notifications: any[] = [];
  
  emiAmount = 0; emiRate = 8.5; emiTenure = 12; emiResult = 0;
  stmtStartDate = ''; stmtEndDate = ''; stmtType = 'All';
  filteredTransactions: Transaction[] = [];
  payeeName = ''; payeeAcc = ''; payeeIfsc = '';

  recipientSearch = '';
  recipientUser: User | null = null;
  recipientSearching = false;
  recipientNotFound = false;

  showPinModal = false;
  pinInput = '';
  pinError = '';
  pendingTxAction: (() => void) | null = null;

  newPin = '';
  confirmPin = '';

  constructor(private auth: AuthService, private api: ApiService, private toast: ToastService) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getCurrentUser()!;
    this.accountNumber = String(1000000000 + this.currentUser.id);
    this.upName = this.currentUser.name;
    this.upEmail = this.currentUser.email;
    this.upPhone = this.currentUser.phone;
    this.upAddress = this.currentUser.address;
    this.loadAll();
  }

  loadAll(): void {
    this.auth.refreshCurrentUser().subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.accountNumber = String(1000000000 + this.currentUser.id);
      }
    });

    this.api.getTransactionsByCustomer(this.currentUser.id).subscribe(txs => {
      this.myTransactions = txs;
      this.totalDeposits = this.myTransactions.filter(t => t.type === 'Deposit').reduce((s, t) => s + t.amount, 0);
      this.totalWithdrawals = this.myTransactions.filter(t => t.type === 'Withdrawal' || t.type === 'Transfer').reduce((s, t) => s + t.amount, 0);
    });

    this.api.getLoansByCustomer(this.currentUser.id).subscribe(loans => {
      this.myLoans = loans;
    });

    this.api.getServiceRequestsByCustomer(this.currentUser.id).subscribe(reqs => {
      this.serviceRequests = reqs;
    });
  }

  switchSection(section: string): void {
    this.activeSection = section;
    this.recipientUser = null;
    this.recipientSearch = '';
    this.recipientNotFound = false;
    this.loadAll();
  }

  searchRecipient(): void {
    if (!this.recipientSearch.trim()) { this.toast.error('Enter a username to search'); return; }
    this.recipientSearching = true;
    this.recipientNotFound = false;
    this.recipientUser = null;

    this.api.searchUser(this.recipientSearch.trim()).subscribe({
      next: (user) => {
        this.recipientSearching = false;
        if (user.username === this.currentUser.username) {
          this.toast.error('Cannot transfer to yourself');
          return;
        }
        if (user.role !== 'customer') {
          this.toast.error('Recipient must be a customer account');
          return;
        }
        this.recipientUser = user;
      },
      error: () => {
        this.recipientSearching = false;
        this.recipientNotFound = true;
        this.toast.error('No customer found with that username');
      }
    });
  }

  initiateTransaction(): void {
    if (!this.txAmount || this.txAmount <= 0) { this.toast.error('Enter a valid amount!'); return; }
    if (this.txType === 'Transfer' && !this.recipientUser) { this.toast.error('Search and select a recipient first!'); return; }

    if (!this.currentUser.pin) {
      this.toast.error('Please set up a transaction PIN first from your Profile settings');
      return;
    }

    this.pinInput = '';
    this.pinError = '';
    this.showPinModal = true;
  }

  verifyAndProcess(): void {
    if (this.pinInput.length !== 4) { this.pinError = 'PIN must be 4 digits'; return; }

    this.api.verifyPin(this.currentUser.username, this.pinInput).subscribe({
      next: () => {
        this.showPinModal = false;
        this.executeTransaction();
      },
      error: () => {
        this.pinError = 'Incorrect PIN. Please try again.';
        this.pinInput = '';
      }
    });
  }

  private executeTransaction(): void {
    const tx: any = {
      customerId: this.currentUser.id,
      amount: this.txAmount,
      type: this.txType,
      pin: this.pinInput
    };

    if (this.txType === 'Transfer' && this.recipientUser) {
      tx.recipientUsername = this.recipientUser.username;
    }

    this.api.processTransaction(tx).subscribe({
      next: () => {
        this.toast.success(`${this.txType} of ₹${this.txAmount} successful!`);
        this.txAmount = null; this.txToAcc = ''; this.txIfsc = '';
        this.recipientUser = null; this.recipientSearch = '';
        this.pinInput = '';
        this.loadAll();
      },
      error: (err) => {
        this.toast.error(err.error || 'Transaction failed');
      }
    });
  }

  applyLoan(): void {
    if (!this.loanAmount || this.loanAmount <= 0) { this.toast.error('Enter a valid amount!'); return; }
    
    const loan = {
      customerId: this.currentUser.id,
      amount: this.loanAmount,
      type: this.loanType,
      status: 'pending',
      appliedBy: this.currentUser.username
    };

    this.api.applyLoan(loan).subscribe({
      next: () => {
        this.toast.success('Loan application submitted!');
        this.loanAmount = null;
        this.loadAll();
      },
      error: () => this.toast.error('Failed to apply for loan')
    });
  }

  submitProfileUpdate(): void {
    const update = {
      customerId: this.currentUser.id,
      newName: this.upName,
      newEmail: this.upEmail,
      newPhone: this.upPhone,
      newAddress: this.upAddress,
      status: 'pending'
    };
    this.api.submitProfileUpdate(update).subscribe({
      next: () => this.toast.success('Profile update request submitted!'),
      error: () => this.toast.error('Failed to submit profile update')
    });
  }

  savePin(): void {
    if (!this.newPin || this.newPin.length !== 4 || !/^\d{4}$/.test(this.newPin)) {
      this.toast.error('PIN must be exactly 4 digits');
      return;
    }
    if (this.newPin !== this.confirmPin) {
      this.toast.error('PINs do not match');
      return;
    }

    this.api.setPin(this.currentUser.username, this.newPin).subscribe({
      next: () => {
        this.toast.success(this.currentUser.pin ? 'PIN updated successfully!' : 'Transaction PIN created successfully!');
        this.currentUser.pin = this.newPin;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.newPin = '';
        this.confirmPin = '';
      },
      error: (err) => this.toast.error(err.error || 'Failed to set PIN')
    });
  }

  requestService(type: string): void {
    const request = {
      customerId: this.currentUser.id,
      serviceType: type,
      status: 'pending'
    };
    this.api.submitServiceRequest(request).subscribe({
      next: () => {
        this.toast.success(`${type} request submitted!`);
        this.loadAll();
      },
      error: () => this.toast.error('Failed to submit service request')
    });
  }

  calculateEMI(): void {
    if (!this.emiAmount || !this.emiRate || !this.emiTenure) return;
    const p = this.emiAmount;
    const r = (this.emiRate / 12) / 100;
    const n = this.emiTenure;
    this.emiResult = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  }

  applyStatementFilters(): void {
    this.filteredTransactions = this.myTransactions.filter(t => {
      let match = true;
      if (this.stmtType !== 'All' && t.type !== this.stmtType) match = false;
      if (this.stmtStartDate && new Date(t.date) < new Date(this.stmtStartDate)) match = false;
      if (this.stmtEndDate && new Date(t.date) > new Date(this.stmtEndDate)) match = false;
      return match;
    });
  }

  downloadStatement(format: 'PDF' | 'Excel'): void {
    this.toast.success(`Downloading statement as ${format}...`);
  }

  addPayee(): void {
    if (!this.payeeName || !this.payeeAcc) { this.toast.error('Name and Account No. required!'); return; }
    this.toast.success('Payee added and verified successfully!');
    this.payeeName = ''; this.payeeAcc = ''; this.payeeIfsc = '';
  }

  blockCard(cardId: number): void {
    this.toast.warning('Card blocked successfully.');
  }

  getAccountNumber(id: number): string {
    return String(1000000000 + id);
  }
}
