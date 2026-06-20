import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header
      class="fixed top-0 right-0 h-16 bg-white dark:bg-secondary-800
             border-b border-secondary-200 dark:border-secondary-700 z-50
             flex items-center justify-between px-6"
      [style.width]="'calc(100% - 0rem)'"
    >
      <!-- Left: Logo & Title -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="material-icons text-white">school</span>
          </div>
          <div class="hidden sm:block">
            <h1 class="text-lg font-semibold text-secondary-900 dark:text-white">
              UCHK
            </h1>
            <p class="text-xs text-secondary-500 dark:text-secondary-400">
              Université Cheikh Hamidou Kane
            </p>
          </div>
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex items-center gap-4">
        <!-- Theme Toggle -->
        <button
          (click)="themeService.toggleTheme()"
          class="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700
                 transition-colors"
          title="Changer le thème"
        >
          <span class="material-icons text-secondary-600 dark:text-secondary-300">
            {{ themeService.theme() === 'dark' ? 'light_mode' : 'dark_mode' }}
          </span>
        </button>

        <!-- Notifications -->
        <button
          class="relative p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700
                 transition-colors"
          title="Notifications"
        >
          <span class="material-icons text-secondary-600 dark:text-secondary-300">
            notifications
          </span>
          <span
            class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
          ></span>
        </button>

        <!-- User Menu -->
        <div class="flex items-center gap-3 ml-2">
          <div class="hidden sm:block text-right">
            <p class="text-sm font-medium text-secondary-900 dark:text-white">
              {{ authService.currentUser()?.prenom }} {{ authService.currentUser()?.nom }}
            </p>
            <p class="text-xs text-secondary-500 dark:text-secondary-400">
              {{ getRoleLabel(authService.userRole()) }}
            </p>
          </div>
          <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full
                      flex items-center justify-center">
            <span class="material-icons text-primary-600 dark:text-primary-400">
              account_circle
            </span>
          </div>
        </div>

        <!-- Logout -->
        <button
          (click)="logout()"
          class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30
                 transition-colors group"
          title="Déconnexion"
        >
          <span
            class="material-icons text-secondary-600 dark:text-secondary-300
                   group-hover:text-red-600 dark:group-hover:text-red-400"
          >
            logout
          </span>
        </button>
      </div>
    </header>
  `,
})
export class TopbarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
  }

  getRoleLabel(role: string | null): string {
    switch (role) {
      case 'ADMIN':
        return 'Administrateur';
      case 'ENSEIGNANT':
        return 'Enseignant';
      case 'ETUDIANT':
        return 'Étudiant';
      default:
        return '';
    }
  }
}
