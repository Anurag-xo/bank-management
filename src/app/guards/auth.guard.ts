import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getCurrentUser();
  const requiredRole = route.data?.['role'] as string | undefined;

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRole && user.role !== requiredRole) {
    router.navigate([`/${user.role}`]);
    return false;
  }

  return true;
};
