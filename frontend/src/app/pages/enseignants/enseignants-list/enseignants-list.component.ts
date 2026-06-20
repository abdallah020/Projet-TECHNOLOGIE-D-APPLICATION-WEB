import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { EnseignantService } from '../../../core/services/enseignant.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/components';

import { Enseignant, EnseignantUpdate } from '../../../core/models';

@Component({
  selector: 'app-enseignants-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EmptyStateComponent],
  template: `
    <div class="space-y-6">

      <!-- HEADER -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Enseignants</h1>
          <p class="text-gray-500">Gestion des enseignants</p>
        </div>

        <button (click)="openModal()" class="btn-primary">
          + Nouveau enseignant
        </button>
      </div>

      <!-- TABLE -->
      <div class="card p-0">

        @if (loading()) {
          <div class="p-6 text-center">Chargement...</div>
        }

        @else if (enseignants().length === 0) {
          <app-empty-state
            icon="person"
            title="Aucun enseignant"
            message="Ajoutez un enseignant"
          />
        }

        @else {
          <table class="w-full">

            <thead class="bg-gray-50">
              <tr>
                <th class="p-4 text-left">Agent</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Spécialité</th>
                <th>Grade</th>
                <th>Statut</th>
                <th class="text-right p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              @for (e of enseignants(); track e.id) {
                <tr class="border-t hover:bg-gray-50">

                  <td class="p-4 font-medium">{{ e.numeroAgent }}</td>
                  <td>{{ e.nom || '-' }}</td>
                  <td>{{ e.prenom || '-' }}</td>
                  <td>{{ e.specialite }}</td>
                  <td>{{ e.grade }}</td>
                  <td>{{ e.statut }}</td>

                  <td class="text-right p-4">
                    <button (click)="openModal(e)" class="mr-2">✏️</button>
                    <button (click)="delete(e)">🗑️</button>
                  </td>

                </tr>
              }
            </tbody>

          </table>
        }

      </div>
    </div>

    <!-- MODAL -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center">

        <div class="bg-white p-6 rounded-xl w-full max-w-lg">

          <h2 class="text-xl font-bold mb-4">
            {{ editing() ? 'Modifier enseignant' : 'Nouvel enseignant' }}
          </h2>

          <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">

            <input formControlName="numeroAgent" class="input-field" placeholder="Numéro agent" />

            <div class="grid grid-cols-2 gap-2">
              <input formControlName="nom" class="input-field" placeholder="Nom" />
              <input formControlName="prenom" class="input-field" placeholder="Prénom" />
            </div>

            <input formControlName="specialite" class="input-field" placeholder="Spécialité" />

            <select formControlName="grade" class="input-field">
              <option value="PROF">Prof</option>
              <option value="MAITRE_ASSISTANT">Maître assistant</option>
              <option value="ASSISTANT">Assistant</option>
            </select>

            <select formControlName="statut" class="input-field">
              <option value="ACTIF">Actif</option>
              <option value="CONGE">Congé</option>
              <option value="INACTIF">Inactif</option>
              <option value="PERMANENT">Permanent</option>
              <option value="VACATAIRE">Vacataire</option>
            </select>

            <div class="flex gap-2">
              <button type="button" (click)="close()" class="btn-secondary w-full">
                Annuler
              </button>
              <button type="submit" class="btn-primary w-full">
                {{ saving() ? '...' : 'Enregistrer' }}
              </button>
            </div>

          </form>

        </div>
      </div>
    }
  `,
})
export class EnseignantsListComponent implements OnInit {

  private service = inject(EnseignantService);
  private dialog = inject(MatDialog);
  private notify = inject(NotificationService);
  private fb = inject(FormBuilder);

  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  editing = signal<Enseignant | null>(null);

  enseignants = signal<Enseignant[]>([]);

  form = this.fb.group({
    numeroAgent: ['', Validators.required],
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    specialite: ['', Validators.required],
    grade: ['PROF', Validators.required],
    statut: ['ACTIF', Validators.required],
  });

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(data => {
      this.enseignants.set(data);
      this.loading.set(false);
    });
  }

  openModal(e?: Enseignant) {
    this.editing.set(e || null);

    if (e) {
      this.form.patchValue({
        numeroAgent: e.numeroAgent,
        nom: e.nom,
        prenom: e.prenom,
        specialite: e.specialite,
        grade: e.grade,
        statut: e.statut,
      });
    } else {
      this.form.reset({
        grade: 'PROF',
        statut: 'ACTIF',
      });
    }

    this.showModal.set(true);
  }

  close() {
    this.showModal.set(false);
    this.editing.set(null);
    this.form.reset();
  }

  save() {
    if (this.form.invalid) return;

    this.saving.set(true);

    const data = this.form.value;
    const edit = this.editing();

    // CREATE
    if (!edit) {
      this.service.create(data as any).subscribe({
        next: () => {
          this.notify.success('Créé avec succès');
          this.load();
          this.close();
        },
        error: () => this.notify.error('Erreur création'),
        complete: () => this.saving.set(false),
      });
      return;
    }

    // UPDATE FIX FINAL
    const payload: EnseignantUpdate = {
      id: edit.id,
      numeroAgent: data.numeroAgent!,
      nom: data.nom!,
      prenom: data.prenom!,
      specialite: data.specialite!,
      grade: data.grade!,
      statut: data.statut as Enseignant['statut'], // 🔥 FIX IMPORTANT
    };

    this.service.update(payload).subscribe({
      next: () => {
        this.notify.success('Modifié avec succès');
        this.load();
        this.close();
      },
      error: () => this.notify.error('Erreur modification'),
      complete: () => this.saving.set(false),
    });
  }

  delete(e: Enseignant) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer',
        message: `Supprimer ${e.nom} ${e.prenom} ?`,
        confirmText: 'Supprimer',
        type: 'danger',
      },
    }).afterClosed().subscribe(res => {
      if (res) {
        this.service.delete(e.id).subscribe(() => {
          this.notify.success('Supprimé');
          this.load();
        });
      }
    });
  }
}