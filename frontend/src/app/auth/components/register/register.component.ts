import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-secondary-900 dark:text-white">
          Inscription
        </h2>

        <p class="text-secondary-500 dark:text-secondary-400 mt-2">
          Créez votre compte étudiant
        </p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label" for="prenom">Prénom</label>
            <input
              id="prenom"
              type="text"
              formControlName="prenom"
              class="input-field"
            />
          </div>

          <div>
            <label class="label" for="nom">Nom</label>
            <input
              id="nom"
              type="text"
              formControlName="nom"
              class="input-field"
            />
          </div>
        </div>

        <div>
          <label class="label" for="email">Email</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="input-field"
          />
        </div>

        <div>
          <label class="label" for="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            formControlName="password"
            class="input-field"
          />
        </div>

        <div>
          <label class="label" for="confirmPassword">
            Confirmer le mot de passe
          </label>

          <input
            id="confirmPassword"
            type="password"
            formControlName="confirmPassword"
            class="input-field"
          />
        </div>

        <button
          type="submit"
          [disabled]="form.invalid || loading()"
          class="w-full btn-primary flex items-center justify-center gap-2"
          [class.opacity-50]="form.invalid || loading()"
        >
          @if (loading()) {
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          }

          <span>
            {{ loading() ? 'Inscription...' : "S'inscrire" }}
          </span>
        </button>

      </form>

      <div class="text-center">
        <p class="text-secondary-500 dark:text-secondary-400">
          Déjà inscrit ?

          <a
            routerLink="/login"
            class="text-primary-600 hover:underline"
          >
            Se connecter
          </a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  loading = signal(false);

  form = this.fb.group({
    prenom: ['', Validators.required],
    nom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  onSubmit(): void {

    if (this.form.invalid) return;

    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.notificationService.error(
        'Les mots de passe ne correspondent pas'
      );
      return;
    }

    this.loading.set(true);

    const payload = {
      prenom: this.form.get('prenom')?.value ?? '',
      nom: this.form.get('nom')?.value ?? '',
      email: this.form.get('email')?.value ?? '',
      motDePasse: password ?? ''
    };

    console.log('REGISTER PAYLOAD =>', payload);

    this.authService.register(payload as any).subscribe({
      next: (response) => {

        console.log('REGISTER SUCCESS =>', response);

        this.loading.set(false);

        this.notificationService.success(
          'Compte créé avec succès !'
        );

        this.router.navigate(['/login']);
      },

      error: (err) => {

        this.loading.set(false);

        console.error('REGISTER ERROR =>', err);

        this.notificationService.error(
          err?.error?.message ||
          "Erreur lors de l'inscription"
        );
      }
    });
  }
}