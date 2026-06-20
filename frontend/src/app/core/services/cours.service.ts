import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { Cours, CoursCreate, CoursUpdate } from '../models';
import { API_BASE_URL } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class CoursService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getAll(): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.baseUrl}/cours`).pipe(
      catchError(() => of([]))
    );
  }

  getById(id: string): Observable<Cours | null> {
    return this.http.get<Cours>(`${this.baseUrl}/cours/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  create(cours: CoursCreate): Observable<Cours | null> {
    return this.http
      .post<Cours>(`${this.baseUrl}/cours`, cours)
      .pipe(catchError(() => of(null)));
  }

  update(id: string, cours: CoursCreate): Observable<Cours | null> {
  return this.http.put<Cours>(`${this.baseUrl}/cours/${id}`, cours);
}

  delete(id: string): Observable<boolean> {
    return this.http
      .delete<void>(`${this.baseUrl}/cours/${id}`)
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }
}
