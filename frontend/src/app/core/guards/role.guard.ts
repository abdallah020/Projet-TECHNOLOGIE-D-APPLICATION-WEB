import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models';

type UserRole = User['role'];

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.userRole();

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    if (authService.isAuthenticated()) {
      const redirectPath = getDashboardPath(userRole);
      router.navigate([redirectPath]);
    } else {
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }

    return false;
  };
};

function getDashboardPath(role: UserRole | null): string {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'ENSEIGNANT':
      return '/enseignant';
    case 'ETUDIANT':
      return '/etudiant';
    default:
      return '/login';
  }
}
