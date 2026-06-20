import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="space-y-6">

      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-secondary-900 dark:text-white">
          Connexion
        </h2>
        <p class="text-secondary-500 dark:text-secondary-400 mt-2">
          Accédez à votre espace personnel
        </p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">

        <!-- Email -->
        <div>
          <label class="label">Email</label>
          <input
            type="email"
            formControlName="email"
            class="input-field"
            placeholder="email@uchk.sn"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="label">Mot de passe</label>
          <input
            [type]="showPassword() ? 'text' : 'password'"
            formControlName="motDePasse"
            class="input-field"
            placeholder="••••••••"
          />

          <button type="button" (click)="togglePassword()" class="text-sm mt-1">
            {{ showPassword() ? 'Masquer' : 'Afficher' }}
          </button>
        </div>

        <!-- Submit -->
        <button
          type="submit"
          [disabled]="form.invalid || loading()"
          class="w-full btn-primary"
        >
          {{ loading() ? 'Connexion...' : 'Se connecter' }}
        </button>

      </form>
    </div>
  `
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  loading = signal(false);
  showPassword = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', [Validators.required]]
  });

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);

    try {
      // IMPORTANT: correspond EXACT backend
      const payload = {
        email: this.form.value.email!,
        motDePasse: this.form.value.motDePasse!
      };

      const result = await firstValueFrom(this.authService.login(payload));

      if (!result) {
        this.notification.error('Erreur de connexion');
        return;
      }

      this.notification.success('Bienvenue');

      this.redirectByRole(result.role);

    } catch (err) {
      this.notification.error('Email ou mot de passe incorrect');
    } finally {
      this.loading.set(false);
    }
  }

  private redirectByRole(role: string) {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'ENSEIGNANT':
        this.router.navigate(['/enseignant']);
        break;
      case 'ETUDIANT':
        this.router.navigate(['/etudiant']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}