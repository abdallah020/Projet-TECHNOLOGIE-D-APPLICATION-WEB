import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { EtudiantService } from '../../../core/services/etudiant.service';
import { FormationService } from '../../../core/services/formation.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmptyStateComponent } from '../../../shared/components';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Etudiant } from '../../../core/models';

@Component({
  selector: 'app-etudiants-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    EmptyStateComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-secondary-900 dark:text-white">
            Étudiants
          </h1>
          <p class="text-secondary-500 dark:text-secondary-400">
            Gestion des étudiants de l'université
          </p>
        </div>
        <button (click)="openModal()" class="btn-primary flex items-center gap-2">
          <span class="material-icons">add</span>
          Nouvel étudiant
        </button>
      </div>

      <!-- Filters -->
      <div class="card">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              type="text"
              [formControl]="searchControl"
              class="input-field"
              placeholder="Rechercher par nom, email, INE..."
            />
          </div>
          <div class="w-full sm:w-48">
            <select [formControl]="formationFilter" class="input-field">
              <option value="">Toutes formations</option>
              @for (formation of formations(); track formation.id) {
                <option [value]="formation.id">{{ formation.nom }}</option>
              }
            </select>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="card p-0 overflow-hidden">
        @if (loading()) {
          <div class="p-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        } @else if (filteredEtudiants().length === 0) {
          <app-empty-state
            icon="school"
            title="Aucun étudiant"
            message="Commencez par ajouter un nouvel étudiant."
          ></app-empty-state>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-secondary-50 dark:bg-secondary-700/50">
                <tr>
                  <th class="text-left py-4 px-6 text-sm font-semibold text-secondary-600 dark:text-secondary-300">
                    Étudiant
                  </th>
                  <th class="text-left py-4 px-6 text-sm font-semibold text-secondary-600 dark:text-secondary-300">
                    INE
                  </th>
                  <th class="text-left py-4 px-6 text-sm font-semibold text-secondary-600 dark:text-secondary-300">
                    Formation
                  </th>
                  <th class="text-left py-4 px-6 text-sm font-semibold text-secondary-600 dark:text-secondary-300">
                    Promo
                  </th>
                  <th class="text-left py-4 px-6 text-sm font-semibold text-secondary-600 dark:text-secondary-300">
                    Années
                  </th>
                  <th class="text-right py-4 px-6 text-sm font-semibold text-secondary-600 dark:text-secondary-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                @for (etudiant of filteredEtudiants(); track etudiant.id) {
                  <tr class="border-t border-secondary-100 dark:border-secondary-700
                             hover:bg-secondary-50 dark:hover:bg-secondary-700/30 transition-colors">
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full
                                    flex items-center justify-center">
                          <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {{ etudiant.prenom[0] }}{{ etudiant.nom[0] }}
                          </span>
                        </div>
                        <div>
                          <p class="font-medium text-secondary-900 dark:text-white">
                            {{ etudiant.prenom }} {{ etudiant.nom }}
                          </p>
                          <p class="text-sm text-secondary-500">{{ etudiant.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-6 text-secondary-600 dark:text-secondary-300">
                      {{ etudiant.ine }}
                    </td>
                    <td class="py-4 px-6 text-secondary-600 dark:text-secondary-300">
                      {{ etudiant.formation }}
                    </td>
                    <td class="py-4 px-6">
                      <span class="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700
                                   dark:text-primary-300 rounded-full text-xs font-medium">
                        {{ etudiant.promo }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-secondary-600 dark:text-secondary-300">
                      {{ etudiant.anneeDebut }} - {{ etudiant.anneeSortie }}
                    </td>
                    <td class="py-4 px-6">
                      <div class="flex items-center justify-end gap-2">
                        <button
                          (click)="openModal(etudiant)"
                          class="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700
                                 text-secondary-600 dark:text-secondary-400 transition-colors"
                          title="Modifier"
                        >
                          <span class="material-icons text-lg">edit</span>
                        </button>
                        <button
                          (click)="deleteEtudiant(etudiant)"
                          class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30
                                 text-red-600 dark:text-red-400 transition-colors"
                          title="Supprimer"
                        >
                          <span class="material-icons text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    <!-- Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
           (click)="closeModal()">
        <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-lg w-full p-6"
             (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-secondary-900 dark:text-white">
              {{ editingEtudiant() ? 'Modifier l\'étudiant' : 'Nouvel étudiant' }}
            </h2>
            <button (click)="closeModal()" class="p-1 rounded hover:bg-secondary-100 dark:hover:bg-secondary-700">
              <span class="material-icons text-secondary-500">close</span>
            </button>
          </div>

          <form [formGroup]="form" (ngSubmit)="saveEtudiant()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Prénom</label>
                <input formControlName="prenom" class="input-field" placeholder="Prénom" />
              </div>
              <div>
                <label class="label">Nom</label>
                <input formControlName="nom" class="input-field" placeholder="Nom" />
              </div>
            </div>

            <div>
              <label class="label">Email</label>
              <input formControlName="email" type="email" class="input-field" placeholder="email@uchk.sn" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">INE</label>
                <input formControlName="ine" class="input-field" placeholder="INE" />
              </div>
              <div>
                <label class="label">Date de naissance</label>
                <input formControlName="dateNaissance" type="date" class="input-field" />
              </div>
            </div>

            <div>
              <label class="label">Formation</label>
              <select formControlName="formation" class="input-field">
                <option value="">Sélectionner une formation</option>
                @for (formation of formations(); track formation.id) {
                  <option [value]="formation.nom">{{ formation.nom }}</option>
                }
              </select>
            </div>

            <div>
              <label class="label">Promo</label>
              <input formControlName="promo" class="input-field" placeholder="2023-2024" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Année début</label>
                <input formControlName="anneeDebut" type="number" class="input-field" />
              </div>
              <div>
                <label class="label">Année fin</label>
                <input formControlName="anneeSortie" type="number" class="input-field" />
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <button type="button" (click)="closeModal()" class="flex-1 btn-secondary">
                Annuler
              </button>
              <button type="submit" [disabled]="form.invalid || saving()" class="flex-1 btn-primary">
                {{ saving() ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class EtudiantsListComponent implements OnInit {
  private readonly etudiantService = inject(EtudiantService);
  private readonly formationService = inject(FormationService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  editingEtudiant = signal<Etudiant | null>(null);
  etudiants = signal<Etudiant[]>([]);
  formations = signal<any[]>([]);

  searchControl = this.fb.control('');
  formationFilter = this.fb.control('');

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    ine: ['', Validators.required],
    dateNaissance: [''],
    formation: [''],
    promo: [''],
    anneeDebut: [2024],
    anneeSortie: [2027],
  });

  filteredEtudiants = signal<Etudiant[]>([]);

  ngOnInit(): void {
    this.loadData();

    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.formationFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  private loadData(): void {
    this.formationService.getAll().subscribe((formations) => {
      this.formations.set(formations);
    });

    this.etudiantService.getAll().subscribe((etudiants) => {
      this.etudiants.set(etudiants);
      this.filteredEtudiants.set(etudiants);
      this.loading.set(false);
    });
  }

  private applyFilters(): void {
    const search = this.searchControl.value?.toLowerCase() || '';
    const formationId = this.formationFilter.value;

    const filtered = this.etudiants().filter((e) => {
      const matchesSearch =
        !search ||
        e.nom.toLowerCase().includes(search) ||
        e.prenom.toLowerCase().includes(search) ||
        e.email.toLowerCase().includes(search) ||
        e.ine.toLowerCase().includes(search);
      const matchesFormation = !formationId || e.formation === formationId;
      return matchesSearch && matchesFormation;
    });

    this.filteredEtudiants.set(filtered);
  }

  openModal(etudiant?: Etudiant): void {
    this.editingEtudiant.set(etudiant || null);
    if (etudiant) {
      this.form.patchValue(etudiant);
    } else {
      this.form.reset();
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingEtudiant.set(null);
    this.form.reset();
  }

  saveEtudiant(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const value = this.form.value;

    if (this.editingEtudiant()) {
      const update = { ...this.editingEtudiant()!, ...value };
      this.etudiantService.update(update as any).subscribe((result) => {
        this.saving.set(false);
        if (result) {
          this.notificationService.success('Étudiant modifié avec succès');
          this.loadData();
          this.closeModal();
        } else {
          this.notificationService.error('Erreur lors de la modification');
        }
      });
    } else {
      this.etudiantService.create(value as any).subscribe((result) => {
        this.saving.set(false);
        if (result) {
          this.notificationService.success('Étudiant créé avec succès');
          this.loadData();
          this.closeModal();
        } else {
          this.notificationService.error('Erreur lors de la création');
        }
      });
    }
  }

  deleteEtudiant(etudiant: Etudiant): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer l\'étudiant',
        message: `Voulez-vous vraiment supprimer ${etudiant.prenom} ${etudiant.nom} ?`,
        confirmText: 'Supprimer',
        type: 'danger',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.etudiantService.delete(etudiant.id).subscribe((success) => {
          if (success) {
            this.notificationService.success('Étudiant supprimé');
            this.loadData();
          }
        });
      }
    });
  }
}
