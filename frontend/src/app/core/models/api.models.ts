import { InjectionToken } from '@angular/core';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  factory: () => 'http://localhost:8080',
  providedIn: 'root',
});

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface DashboardStats {
  totalEtudiants: number;
  totalEnseignants: number;
  totalFormations: number;
  totalCommunications: number;
  inscriptionsRecentes: number;
}
