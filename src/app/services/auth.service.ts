import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/models';
import { Observable, tap, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private router: Router, private http: HttpClient) {}

  login(username: string, password: string): Observable<User | null> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(user => {
        if (user) {
          const storedUser = { ...user } as any;
          delete storedUser.password;
          localStorage.setItem('currentUser', JSON.stringify(storedUser));
        }
      }),
      catchError(() => of(null))
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  refreshCurrentUser(): Observable<User | null> {
    const current = this.getCurrentUser();
    if (!current) return of(null);
    return this.http.get<User>(`${this.apiUrl}/${current.id}`).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }),
      catchError(() => of(null))
    );
  }
}
