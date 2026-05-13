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
}

export interface Loan {
  id: number;
  customerId: number;
  type?: string;
  amount: number;
  interest?: string;
  timeline?: string;
  document?: string;
  status: 'pending' | 'approved' | 'rejected' | 'pending_emp';
  appliedBy: string;
  reviewedBy?: string;
}

export interface Transaction {
  id: number;
  customerId: number;
  amount: number;
  type: string;
  date: string;
  toAcc?: string;
  ifsc?: string;
}

export interface ProfileUpdate {
  id: number;
  customerId: number;
  newName: string;
  newEmail: string;
  newPhone: string;
  newAddress: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ServiceRequest {
  id: number;
  customerId: number;
  serviceType: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}
