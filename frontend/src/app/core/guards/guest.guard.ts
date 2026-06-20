import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  const userRole = authService.userRole();
  const redirectPath = getDashboardPath(userRole);
  router.navigate([redirectPath]);

  return false;
};

function getDashboardPath(role: string | null): string {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'ENSEIGNANT':
      return '/enseignant';
    case 'ETUDIANT':
      return '/etudiant';
    default:
      return '/';
  }
}
