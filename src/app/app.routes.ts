import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) },
  { path: 'manager', loadComponent: () => import('./admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [authGuard], data: { role: 'manager' } },
  { path: 'employee', loadComponent: () => import('./employee/employee-dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent), canActivate: [authGuard], data: { role: 'employee' } },
  { path: 'customer', loadComponent: () => import('./customer/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent), canActivate: [authGuard], data: { role: 'customer' } },
  { path: '**', redirectTo: '' }
];
