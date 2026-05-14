export interface User {
  id: number;
  role: 'manager' | 'employee' | 'customer';
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance?: number;
  cibil?: number;
  status?: string;
  pin?: string;
  aadharCard?: string;
  panCard?: string;
}

export interface Loan {
  id: number;
  customerUsername: string;
  loanBasis?: string;
  type?: string;
  amount: number;
  interest?: string;
  timeline?: string;
  document?: string;
  collateralDetails?: string;
  emiMonths?: number;
  emiAmount?: number;
  verificationStatus?: string;
  status: 'pending' | 'approved' | 'rejected' | 'pending_emp';
  appliedBy: string;
  reviewedBy?: string;
}

export interface Transaction {
  id: number;
  customerUsername: string;
  amount: number;
  type: string;
  date: string;
  toAcc?: string;
  ifsc?: string;
  recipientUsername?: string;
  pin?: string;
}

export interface ProfileUpdate {
  id: number;
  customerUsername: string;
  newName: string;
  newEmail: string;
  newPhone: string;
  newAddress: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ServiceRequest {
  id: number;
  customerUsername: string;
  serviceType: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}
