import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, Loan, User, ProfileUpdate, ServiceRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getTransactionsByCustomer(id: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions/customer/${id}`);
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }

  processTransaction(tx: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transactions`, tx, { responseType: 'text' });
  }

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/loans`);
  }

  getLoansByCustomer(id: number): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/loans/customer/${id}`);
  }

  applyLoan(loan: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/loans`, loan, { responseType: 'text' });
  }

  updateLoanStatus(id: number, status: string, reviewedBy: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/loans/${id}/status?status=${status}&reviewedBy=${reviewedBy}`, {}, { responseType: 'text' });
  }

  getProfileUpdates(): Observable<ProfileUpdate[]> {
    return this.http.get<ProfileUpdate[]>(`${this.apiUrl}/profile-updates`);
  }

  updateProfileStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile-updates/${id}/status?status=${status}`, {});
  }

  submitProfileUpdate(update: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile-updates`, update, { responseType: 'text' });
  }

  getServiceRequestsByCustomer(id: number): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(`${this.apiUrl}/service-requests/customer/${id}`);
  }

  submitServiceRequest(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/service-requests`, request, { responseType: 'text' });
  }
}
