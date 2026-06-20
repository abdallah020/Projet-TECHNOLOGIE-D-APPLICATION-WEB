import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { Formation, FormationCreate, FormationUpdate } from '../models';
import { API_BASE_URL } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class FormationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getAll(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.baseUrl}/formations`).pipe(
      catchError(() => of([]))
    );
  }

  getById(id: string): Observable<Formation | null> {
    return this.http
      .get<Formation>(`${this.baseUrl}/formations/${id}`)
      .pipe(catchError(() => of(null)));
  }

  create(formation: FormationCreate): Observable<Formation | null> {
    return this.http
      .post<Formation>(`${this.baseUrl}/formations`, formation)
      .pipe(catchError(() => of(null)));
  }

  update(formation: FormationUpdate): Observable<Formation | null> {
    return this.http
      .put<Formation>(`${this.baseUrl}/formations/${formation.id}`, formation)
      .pipe(catchError(() => of(null)));
  }

  delete(id: string): Observable<boolean> {
    return this.http
      .delete<void>(`${this.baseUrl}/formations/${id}`)
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }
}
