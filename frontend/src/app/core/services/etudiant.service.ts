import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { Etudiant, EtudiantCreate, EtudiantUpdate } from '../models';
import { API_BASE_URL } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class EtudiantService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getAll(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(`${this.baseUrl}/etudiants`).pipe(
      catchError(() => of([]))
    );
  }

  getById(id: string): Observable<Etudiant | null> {
    return this.http.get<Etudiant>(`${this.baseUrl}/etudiants/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  create(etudiant: EtudiantCreate): Observable<Etudiant | null> {
    return this.http
      .post<Etudiant>(`${this.baseUrl}/etudiants`, etudiant)
      .pipe(catchError(() => of(null)));
  }

  update(etudiant: EtudiantUpdate): Observable<Etudiant | null> {
    return this.http
      .put<Etudiant>(`${this.baseUrl}/etudiants/${etudiant.id}`, etudiant)
      .pipe(catchError(() => of(null)));
  }

  delete(id: string): Observable<boolean> {
    return this.http
      .delete<void>(`${this.baseUrl}/etudiants/${id}`)
      .pipe(
        catchError(() => of(null)),
        map(() => true),
        catchError(() => of(false))
      );
  }
}
