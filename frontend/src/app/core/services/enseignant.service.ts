import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { Enseignant, EnseignantCreate, EnseignantUpdate } from '../models';
import { API_BASE_URL } from '../models/api.models';

@Injectable({
  providedIn: 'root',
})
export class EnseignantService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getAll() {
    return this.http.get<Enseignant[]>(`${this.baseUrl}/enseignants`)
      .pipe(catchError(() => of([])));
  }

  getById(id: string) {
    return this.http.get<Enseignant>(`${this.baseUrl}/enseignants/${id}`)
      .pipe(catchError(() => of(null)));
  }

  create(payload: EnseignantCreate) {
    return this.http.post<Enseignant>(
      `${this.baseUrl}/enseignants`,
      payload
    ).pipe(catchError(() => of(null)));
  }

  update(payload: EnseignantUpdate) {
    return this.http.put<Enseignant>(
      `${this.baseUrl}/enseignants/${payload.id}`,
      payload
    ).pipe(catchError(() => of(null)));
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/enseignants/${id}`)
      .pipe(map(() => true), catchError(() => of(false)));
  }
}