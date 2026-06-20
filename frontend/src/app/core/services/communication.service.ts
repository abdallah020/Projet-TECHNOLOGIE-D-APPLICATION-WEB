import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { Communication, CommunicationCreate, CommunicationUpdate } from '../models';
import { API_BASE_URL } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getAll(): Observable<Communication[]> {
    return this.http.get<Communication[]>(`${this.baseUrl}/communications`).pipe(
      catchError(() => of([]))
    );
  }

  getById(id: string): Observable<Communication | null> {
    return this.http
      .get<Communication>(`${this.baseUrl}/communications/${id}`)
      .pipe(catchError(() => of(null)));
  }

  create(communication: CommunicationCreate): Observable<Communication | null> {
    return this.http
      .post<Communication>(`${this.baseUrl}/communications`, communication)
      .pipe(catchError(() => of(null)));
  }

  update(communication: CommunicationUpdate): Observable<Communication | null> {
    return this.http
      .put<Communication>(`${this.baseUrl}/communications/${communication.id}`, communication)
      .pipe(catchError(() => of(null)));
  }

  delete(id: string): Observable<boolean> {
    return this.http
      .delete<void>(`${this.baseUrl}/communications/${id}`)
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }
}
