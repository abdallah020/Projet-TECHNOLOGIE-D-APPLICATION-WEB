import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InscriptionService } from '../../../core/services/inscription.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmptyStateComponent } from '../../../shared/components';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Inscription } from '../../../core/models';

@Component({
  selector: 'app-inscriptions-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmptyStateComponent,
  ],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-secondary-900 dark:text-white">
            Inscriptions
          </h1>
          <p class="text-secondary-500 dark:text-secondary-400">
            Validation et gestion des inscriptions
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div class="card flex items-center gap-3 py-4">
          <div class="w-10 h-10 rounded-lg bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
            <span class="material-icons text-secondary-600">how_to_reg</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-secondary-900 dark:text-white">{{ stats().total }}</p>
            <p class="text-xs text-secondary-500">Total</p>
          </div>
        </div>
        <div class="card flex items-center gap-3 py-4">
          <div class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <span class="material-icons text-yellow-600">pending</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-secondary-900 dark:text-white">{{ stats().enAttente }}</p>
            <p class="text-xs text-secondary-500">En attente</p>
          </div>
        </div>
        <div class="card flex items-center gap-3 py-4">
          <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <span class="material-icons text-green-600">check_circle</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-secondary-900 dark:text-white">{{ stats().validees }}</p>
            <p class="text-xs text-secondary-500">Validées</p>
          </div>
        </div>
        <div class="card flex items-center gap-3 py-4">
          <div class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span class="material-icons text-red-600">cancel</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-secondary-900 dark:text-white">{{ stats().rejetees }}</p>
            <p class="text-xs text-secondary-500">Rejetées</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <input
              type="text"
              [formControl]="searchControl"
              class="input-field"
              placeholder="Rechercher..."
            />
          </div>
          <div class="w-full sm:w-48">
            <select [formControl]="statutFilter" class="input-field">
              <option value="">Tous statuts</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="VALIDÉ">Validées</option>
              <option value="REJETÉ">Rejetées</option>
              <option value="INSCRIT">Inscrites</option>
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
        } @else if (filteredInscriptions().length === 0) {
          <app-empty-state
            icon="how_to_reg"
            title="Aucune inscription"
            message="Aucune inscription à afficher."
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
                    Formation
                  </th>
                  <th class="text-left py-4 px-6 text-sm font-semibold text-secondary-600 dark:text-secondary-300">
                    Statut
                  </th>
                  <th class="text-left py-4 px-6 text-sm font-semibold text-secondary-600 dark:text-secondary-300">
                    Date
                  </th>
                  <th class="text-right py-4 px-6 text-sm font-semibold text-secondary-600 dark:text-secondary-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                @for (inscription of filteredInscriptions(); track inscription.id) {
                  <tr class="border-t border-secondary-100 dark:border-secondary-700
                             hover:bg-secondary-50 dark:hover:bg-secondary-700/30 transition-colors">
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full
                                    flex items-center justify-center">
                          <span class="text-sm font-medium text-primary-600 dark:text-primary-400">
                            {{ inscription.etudiantPrenom[0] }}{{ inscription.etudiantNom[0] }}
                          </span>
                        </div>
                        <div>
                          <p class="font-medium text-secondary-900 dark:text-white">
                            {{ inscription.etudiantPrenom }} {{ inscription.etudiantNom }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-6">
                      <div>
                        <p class="text-secondary-900 dark:text-white">{{ inscription.formationNom }}</p>
                        <p class="text-sm text-secondary-500">{{ inscription.formationCode }}</p>
                      </div>
                    </td>
                    <td class="py-4 px-6">
                      <span class="px-3 py-1 rounded-full text-xs font-medium"
                            [class.bg-yellow-100]="inscription.statut === 'EN_ATTENTE'"
                            [class.text-yellow-700]="inscription.statut === 'EN_ATTENTE'"
                            [class.bg-green-100]="inscription.statut === 'VALIDÉ'"
                            [class.text-green-700]="inscription.statut === 'VALIDÉ'"
                            [class.bg-red-100]="inscription.statut === 'REJETÉ'"
                            [class.text-red-700]="inscription.statut === 'REJETÉ'"
                            [class.bg-blue-100]="inscription.statut === 'INSCRIT'"
                            [class.text-blue-700]="inscription.statut === 'INSCRIT'">
                        {{ inscription.statut }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-secondary-600 dark:text-secondary-300">
                      {{ inscription.dateInscription | date:'dd/MM/yyyy' }}
                    </td>
                    <td class="py-4 px-6">
                      @if (inscription.statut === 'EN_ATTENTE' || inscription.statut === 'INSCRIT') {
                        <div class="flex items-center justify-end gap-2">
                          <button
                            (click)="validateInscription(inscription)"
                            class="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30
                                   text-green-600 dark:text-green-400 transition-colors"
                            title="Valider"
                          >
                            <span class="material-icons text-lg">check_circle</span>
                          </button>
                          <button
                            (click)="rejectInscription(inscription)"
                            class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30
                                   text-red-600 dark:text-red-400 transition-colors"
                            title="Rejeter"
                          >
                            <span class="material-icons text-lg">cancel</span>
                          </button>
                        </div>
                      } @else {
                        <span class="text-secondary-400 text-sm">-</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class InscriptionsListComponent implements OnInit {
  private readonly inscriptionService = inject(InscriptionService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  loading = signal(true);
  inscriptions = signal<Inscription[]>([]);

  searchControl = this.fb.control('');
  statutFilter = this.fb.control('');

  stats = signal({ total: 0, enAttente: 0, validees: 0, rejetees: 0 });

  filteredInscriptions = signal<Inscription[]>([]);

  ngOnInit(): void {
    this.loadData();

    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.statutFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  private loadData(): void {
    this.inscriptionService.getAll().subscribe((inscriptions) => {
      this.inscriptions.set(inscriptions);
      this.updateStats(inscriptions);
      this.filteredInscriptions.set(inscriptions);
      this.loading.set(false);
    });
  }

  private updateStats(inscriptions: Inscription[]): void {
    this.stats.set({
      total: inscriptions.length,
      enAttente: inscriptions.filter((i) => i.statut === 'EN_ATTENTE').length,
      validees: inscriptions.filter((i) => i.statut === 'VALIDÉ').length,
      rejetees: inscriptions.filter((i) => i.statut === 'REJETÉ').length,
    });
  }

  private applyFilters(): void {
    const search = this.searchControl.value?.toLowerCase() || '';
    const statut = this.statutFilter.value;

    const filtered = this.inscriptions().filter((i) => {
      const matchesSearch =
        !search ||
        i.etudiantNom.toLowerCase().includes(search) ||
        i.etudiantPrenom.toLowerCase().includes(search) ||
        i.formationNom.toLowerCase().includes(search);
      const matchesStatut = !statut || i.statut === statut;
      return matchesSearch && matchesStatut;
    });

    this.filteredInscriptions.set(filtered);
  }

  validateInscription(inscription: Inscription): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Valider l\'inscription',
        message: `Voulez-vous valider l'inscription de ${inscription.etudiantPrenom} ${inscription.etudiantNom} ?`,
        confirmText: 'Valider',
        type: 'info',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.inscriptionService.valider(inscription.id).subscribe((result) => {
          if (result) {
            this.notificationService.success('Inscription validée');
            this.loadData();
          } else {
            this.notificationService.error('Erreur lors de la validation');
          }
        });
      }
    });
  }

  rejectInscription(inscription: Inscription): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Rejeter l\'inscription',
        message: `Voulez-vous rejeter l'inscription de ${inscription.etudiantPrenom} ${inscription.etudiantNom} ?`,
        confirmText: 'Rejeter',
        type: 'danger',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.inscriptionService.rejeter(inscription.id).subscribe((result) => {
          if (result) {
            this.notificationService.success('Inscription rejetée');
            this.loadData();
          } else {
            this.notificationService.error('Erreur lors du rejet');
          }
        });
      }
    });
  }
}
