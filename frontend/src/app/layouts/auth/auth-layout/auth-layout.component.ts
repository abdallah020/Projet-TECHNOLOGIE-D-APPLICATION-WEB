import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50
                dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900
                flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16
                      bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <span class="material-icons text-white text-3xl">school</span>
          </div>
          <h1 class="text-2xl font-bold text-secondary-900 dark:text-white">
            UCHK
          </h1>
          <p class="text-secondary-500 dark:text-secondary-400 mt-1">
            Université Cheikh Hamidou Kane
          </p>
        </div>

        <!-- Content -->
        <div class="card">
          <router-outlet></router-outlet>
        </div>

        <!-- Footer -->
        <p class="text-center text-sm text-secondary-500 dark:text-secondary-400 mt-6">
          &copy; {{ currentYear }} Université Cheikh Hamidou Kane. Tous droits réservés.
        </p>
      </div>
    </div>
  `,
})
export class AuthLayoutComponent {
  currentYear = new Date().getFullYear();
}
