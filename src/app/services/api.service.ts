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

  getTransactionsByCustomer(username: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions/customer/${username}`);
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

  getLoansByCustomer(username: string): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/loans/customer/${username}`);
  }

  applyLoan(loan: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/loans`, loan, { responseType: 'text' });
  }

  updateLoanStatus(id: number, status: string, reviewedBy: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/loans/${id}/status?status=${status}&reviewedBy=${reviewedBy}`, {}, { responseType: 'text' });
  }

  updateLoanVerificationStatus(id: number, verificationStatus: string, reviewedBy: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/loans/${id}/verify?verificationStatus=${verificationStatus}&reviewedBy=${reviewedBy}`, {}, { responseType: 'text' });
  }

  getProfileUpdates(): Observable<ProfileUpdate[]> {
    return this.http.get<ProfileUpdate[]>(`${this.apiUrl}/profile-updates`);
  }

  updateProfileStatus(id: number, status: string, reviewedBy: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile-updates/${id}/status?status=${status}&reviewedBy=${reviewedBy}`, {});
  }

  submitProfileUpdate(update: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/profile-updates`, update, { responseType: 'text' });
  }

  getServiceRequestsByCustomer(username: string): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(`${this.apiUrl}/service-requests/customer/${username}`);
  }

  submitServiceRequest(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/service-requests`, request, { responseType: 'text' });
  }

  searchUser(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/search?username=${username}`);
  }

  setPin(username: string, pin: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/set-pin`, { username, pin }, { responseType: 'text' });
  }

  verifyPin(username: string, pin: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/verify-pin`, { username, pin }, { responseType: 'text' });
  }

  deleteUser(username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${username}`, { responseType: 'text' });
  }

  holdUser(username: string, hold: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${username}/hold?hold=${hold}`, {}, { responseType: 'text' });
  }
}
