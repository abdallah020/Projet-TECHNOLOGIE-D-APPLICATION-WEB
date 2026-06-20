import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { FormationService } from '../../../core/services/formation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmptyStateComponent } from '../../../shared/components';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Formation } from '../../../core/models';

@Component({
  selector: 'app-formations-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EmptyStateComponent],
  template: `
    <div class="space-y-6">

      <!-- HEADER -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Formations</h1>
          <p class="text-gray-500">Gestion des formations</p>
        </div>

        <button (click)="openModal()" class="btn-primary">
          + Nouvelle formation
        </button>
      </div>

      <!-- FILTERS -->
      <div class="card flex gap-4">
        <input
          type="text"
          [formControl]="searchControl"
          class="input-field flex-1"
          placeholder="Rechercher..."
        />

        <select [formControl]="niveauFilter" class="input-field w-48">
          <option value="">Tous niveaux</option>
          <option value="LICENCE">Licence</option>
          <option value="MASTER">Master</option>
          <option value="DOCTORAT">Doctorat</option>
        </select>
      </div>

      <!-- TABLE -->
      <div class="card p-0">

        @if (loading()) {
          <div class="p-6 text-center">Chargement...</div>
        }

        @else if (filteredFormations().length === 0) {
          <app-empty-state
            icon="workspace_premium"
            title="Aucune formation"
            message="Commencez par créer une formation"
          />
        }

        @else {
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="text-left p-4">Code</th>
                <th>Nom</th>
                <th>Niveau</th>
                <th>Statut</th>
                <th class="text-right p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              @for (f of filteredFormations(); track f.id) {
                <tr class="border-t hover:bg-gray-50">
                  <td class="p-4 font-medium">{{ f?.code }}</td>
                  <td>{{ f?.nom }}</td>
                  <td>{{ f?.niveau }}</td>
                  <td>{{ f?.statut ?? '-' }}</td>

                  <td class="text-right p-4">
                    <button (click)="openModal(f)" class="mr-2">✏️</button>
                    <button (click)="deleteFormation(f)">🗑️</button>
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
            {{ editingFormation() ? 'Modifier formation' : 'Nouvelle formation' }}
          </h2>

          <form [formGroup]="form" (ngSubmit)="saveFormation()" class="space-y-4">

            <input formControlName="code" class="input-field" placeholder="Code" />
            <input formControlName="nom" class="input-field" placeholder="Nom" />
            <input formControlName="description" class="input-field" placeholder="Description" />

            <select formControlName="niveau" class="input-field">
              <option value="LICENCE">Licence</option>
              <option value="MASTER">Master</option>
              <option value="DOCTORAT">Doctorat</option>
            </select>

            <select formControlName="typeFormation" class="input-field">
              <option value="DIPLÔMANTE">Diplômante</option>
              <option value="CERTIFICATION">Certification</option>
              <option value="COURTE">Courte</option>
            </select>

            <!-- STATUT -->
            <select formControlName="statut" class="input-field">
              <option value="PLANIFIEE">Planifiée</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINEE">Terminée</option>
              <option value="ANNULEE">Annulée</option>
            </select>

            <input type="date" formControlName="dateDebut" class="input-field" />
            <input type="date" formControlName="dateFin" class="input-field" />

            <input type="number" formControlName="budgetTotal" class="input-field" placeholder="Budget" />

            <div class="flex gap-2">
              <button type="button" (click)="closeModal()" class="btn-secondary w-full">
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
export class FormationsListComponent implements OnInit {

  private formationService = inject(FormationService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);

  editingFormation = signal<Formation | null>(null);

  formations = signal<Formation[]>([]);
  filteredFormations = signal<Formation[]>([]);

  searchControl = this.fb.control('');
  niveauFilter = this.fb.control('');

  form = this.fb.group({
    code: ['', Validators.required],
    nom: ['', Validators.required],
    description: [''],

    niveau: ['MASTER', Validators.required],

    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],

    budgetTotal: [0, Validators.required],

    typeFormation: ['DIPLÔMANTE', Validators.required],
    typeFinancement: ['PUBLIC'],

    statut: ['PLANIFIEE', Validators.required],
  });

  ngOnInit(): void {
    this.loadData();
    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.niveauFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  private loadData(): void {
    this.formationService.getAll().subscribe(data => {
      this.formations.set(data ?? []);
      this.filteredFormations.set(data ?? []);
      this.loading.set(false);
    });
  }

  private applyFilters(): void {
    const search = this.searchControl.value?.toLowerCase() || '';
    const niveau = this.niveauFilter.value;

    this.filteredFormations.set(
      this.formations().filter(f =>
        (!search ||
          f?.nom?.toLowerCase().includes(search) ||
          f?.code?.toLowerCase().includes(search)
        ) &&
        (!niveau || f?.niveau === niveau)
      )
    );
  }

  openModal(f?: Formation): void {
    this.editingFormation.set(f || null);

    if (f) {
      this.form.patchValue({
        code: f.code ?? '',
        nom: f.nom ?? '',
        description: f.description ?? '',
        niveau: f.niveau ?? 'MASTER',
        typeFormation: f.typeFormation ?? 'DIPLÔMANTE',
        statut: f.statut ?? 'PLANIFIEE',
        dateDebut: f.dateDebut ? f.dateDebut.toString().split('T')[0] : '',
        dateFin: f.dateFin ? f.dateFin.toString().split('T')[0] : '',
        budgetTotal: f.budgetTotal ?? 0,
      });
    } else {
      this.form.reset({
        niveau: 'MASTER',
        typeFormation: 'DIPLÔMANTE',
        typeFinancement: 'PUBLIC',
        statut: 'PLANIFIEE',
        budgetTotal: 0,
      });
    }

    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingFormation.set(null);
    this.form.reset();
  }

  saveFormation(): void {
    if (this.form.invalid) return;

    this.saving.set(true);

    const v = this.form.value;
    const editing = this.editingFormation();

    const payload = {
      code: v.code!,
      nom: v.nom!,
      description: v.description ?? '',
      niveau: v.niveau!,
      dateDebut: v.dateDebut,
      dateFin: v.dateFin,
      budgetTotal: v.budgetTotal,
      typeFormation: v.typeFormation!,
      typeFinancement: v.typeFinancement ?? 'PUBLIC',
      statut: v.statut!,
    };

    const request$ = editing
      ? this.formationService.update({ id: editing.id, ...payload } as any)
      : this.formationService.create(payload as any);

    request$.subscribe({
      next: () => {
        this.notificationService.success(
          editing ? 'Formation modifiée' : 'Formation créée'
        );
        this.loadData();
        this.closeModal();
      },
      error: () => this.notificationService.error('Erreur serveur'),
      complete: () => this.saving.set(false),
    });
  }

  deleteFormation(f: Formation): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer',
        message: `Supprimer ${f.nom} ?`,
        confirmText: 'Supprimer',
        type: 'danger',
      },
    }).afterClosed().subscribe(ok => {
      if (ok) {
        this.formationService.delete(f.id).subscribe(() => {
          this.notificationService.success('Supprimé');
          this.loadData();
        });
      }
    });
  }
}