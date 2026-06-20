import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models';
import { API_BASE_URL } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = inject(API_BASE_URL);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role ?? null);

  constructor() {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUser.set(user);
      } catch {
        this.clearAuth();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse | null> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          console.error('Login failed:', error);
          return of(null);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse | null> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/auth/register`, userData)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          console.error('Registration failed:', error);
          return of(null);
        })
      );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const user: User = {
      id: response.id,
      email: response.email,
      nom: response.nom,
      prenom: response.prenom,
      role: response.role,
      token: response.token,
    };

    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout(): void {
    this.clearAuth();
    this.router.navigate(['/login']);
  }

  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAdmin(): boolean {
    return this.userRole() === 'ADMIN';
  }

  isEnseignant(): boolean {
    return this.userRole() === 'ENSEIGNANT';
  }

  isEtudiant(): boolean {
    return this.userRole() === 'ETUDIANT';
  }
}
