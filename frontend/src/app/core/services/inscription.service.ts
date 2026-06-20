import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Inscription, InscriptionCreate } from '../models';
import { API_BASE_URL } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class InscriptionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getAll(): Observable<Inscription[]> {
    return this.http.get<Inscription[]>(`${this.baseUrl}/inscriptions`).pipe(
      catchError(() => of([]))
    );
  }

  create(inscription: InscriptionCreate): Observable<Inscription | null> {
    return this.http
      .post<Inscription>(`${this.baseUrl}/inscriptions`, inscription)
      .pipe(catchError(() => of(null)));
  }

  valider(id: string): Observable<Inscription | null> {
    return this.http
      .patch<Inscription>(`${this.baseUrl}/inscriptions/${id}/valider`, {})
      .pipe(catchError(() => of(null)));
  }

  rejeter(id: string): Observable<Inscription | null> {
    return this.http
      .patch<Inscription>(`${this.baseUrl}/inscriptions/${id}/rejeter`, {})
      .pipe(catchError(() => of(null)));
  }
}
