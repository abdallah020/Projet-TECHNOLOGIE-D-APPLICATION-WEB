import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommunicationService } from '../../../core/services/communication.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmptyStateComponent } from '../../../shared/components';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Communication } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-communications-list',
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
            Communications
          </h1>
          <p class="text-secondary-500 dark:text-secondary-400">
            Annonces et informations importantes
          </p>
        </div>
        @if (authService.isAdmin() || authService.isEnseignant()) {
          <button (click)="openModal()" class="btn-primary flex items-center gap-2">
            <span class="material-icons">add</span>
            Nouvelle communication
          </button>
        }
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
            <select [formControl]="typeFilter" class="input-field">
              <option value="">Tous types</option>
              <option value="INFO">Information</option>
              <option value="REUNION">Réunion</option>
              <option value="ANNONCE">Annonce</option>
            </select>
          </div>
          <div class="w-full sm:w-48">
            <select [formControl]="statutFilter" class="input-field">
              <option value="">Tous statuts</option>
              <option value="PUBLIÉ">Publiées</option>
              <option value="BROUILLON">Brouillons</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Cards -->
      @if (loading()) {
        <div class="card p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      } @else if (filteredCommunications().length === 0) {
        <app-empty-state
          icon="campaign"
          title="Aucune communication"
          message="Aucune communication à afficher."
        ></app-empty-state>
      } @else {
        <div class="space-y-4">
          @for (communication of filteredCommunications(); track communication.id) {
            <div class="card-hover group">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                     [class.bg-blue-100]="communication.typeCommunication === 'INFO'"
                     [class.text-blue-600]="communication.typeCommunication === 'INFO'"
                     [class.bg-purple-100]="communication.typeCommunication === 'REUNION'"
                     [class.text-purple-600]="communication.typeCommunication === 'REUNION'"
                     [class.bg-yellow-100]="communication.typeCommunication === 'ANNONCE'"
                     [class.text-yellow-600]="communication.typeCommunication === 'ANNONCE'">
                  <span class="material-icons">
                    {{ communication.typeCommunication === 'REUNION' ? 'event' : 'campaign' }}
                  </span>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span class="px-2 py-1 rounded text-xs font-medium"
                              [class.bg-blue-100]="communication.typeCommunication === 'INFO'"
                              [class.text-blue-700]="communication.typeCommunication === 'INFO'"
                              [class.bg-purple-100]="communication.typeCommunication === 'REUNION'"
                              [class.text-purple-700]="communication.typeCommunication === 'REUNION'"
                              [class.bg-yellow-100]="communication.typeCommunication === 'ANNONCE'"
                              [class.text-yellow-700]="communication.typeCommunication === 'ANNONCE'">
                          {{ communication.typeCommunication }}
                        </span>
                        <span class="px-2 py-1 rounded text-xs font-medium"
                              [class.bg-green-100]="communication.statut === 'PUBLIÉ'"
                              [class.text-green-700]="communication.statut === 'PUBLIÉ'"
                              [class.bg-gray-100]="communication.statut === 'BROUILLON'"
                              [class.text-gray-700]="communication.statut === 'BROUILLON'">
                          {{ communication.statut }}
                        </span>
                      </div>
                      <h3 class="text-lg font-semibold text-secondary-900 dark:text-white">
                        {{ communication.titre }}
                      </h3>
                    </div>
                    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        (click)="openModal(communication)"
                        class="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700
                               text-secondary-600 dark:text-secondary-400"
                        title="Modifier"
                      >
                        <span class="material-icons text-lg">edit</span>
                      </button>
                      <button
                        (click)="deleteCommunication(communication)"
                        class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30
                               text-red-600 dark:text-red-400"
                        title="Supprimer"
                      >
                        <span class="material-icons text-lg">delete</span>
                      </button>
                    </div>
                  </div>

                  <p class="text-secondary-600 dark:text-secondary-300 mb-3 line-clamp-2">
                    {{ communication.contenu }}
                  </p>

                  <div class="flex items-center gap-4 text-sm text-secondary-500">
                    <span class="flex items-center gap-1">
                      <span class="material-icons text-xs">person</span>
                      {{ communication.auteurNom }}
                    </span>
                    <span class="flex items-center gap-1">
                      <span class="material-icons text-xs">schedule</span>
                      {{ communication.dateCreation | date:'dd MMM yyyy à HH:mm' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Modal -->
    @if (showModal()) {
      <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
           (click)="closeModal()">
        <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
             (click)="$event.stopPropagation()">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-secondary-900 dark:text-white">
              {{ editingCommunication() ? 'Modifier' : 'Nouvelle communication' }}
            </h2>
            <button (click)="closeModal()" class="p-1 rounded hover:bg-secondary-100 dark:hover:bg-secondary-700">
              <span class="material-icons text-secondary-500">close</span>
            </button>
          </div>

          <form [formGroup]="form" (ngSubmit)="saveCommunication()" class="space-y-4">
            <div>
              <label class="label">Titre</label>
              <input formControlName="titre" class="input-field" placeholder="Titre de la communication" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Type</label>
                <select formControlName="typeCommunication" class="input-field">
                  <option value="INFO">Information</option>
                  <option value="REUNION">Réunion</option>
                  <option value="ANNONCE">Annonce</option>
                </select>
              </div>
              <div>
                <label class="label">Statut</label>
                <select formControlName="statut" class="input-field">
                  <option value="BROUILLON">Brouillon</option>
                  <option value="PUBLIÉ">Publier</option>
                </select>
              </div>
            </div>

            <div>
              <label class="label">Contenu</label>
              <textarea formControlName="contenu" class="input-field" rows="5"
                        placeholder="Contenu de la communication..."></textarea>
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
export class CommunicationsListComponent implements OnInit {
  private readonly communicationService = inject(CommunicationService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);
  authService = inject(AuthService);

  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  editingCommunication = signal<Communication | null>(null);
  communications = signal<Communication[]>([]);

  searchControl = this.fb.control('');
  typeFilter = this.fb.control('');
  statutFilter = this.fb.control('');

  form = this.fb.group({
    titre: ['', Validators.required],
    contenu: ['', Validators.required],
    typeCommunication: ['INFO', Validators.required],
    statut: ['BROUILLON', Validators.required],
  });

  filteredCommunications = signal<Communication[]>([]);

  ngOnInit(): void {
    this.loadData();

    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.typeFilter.valueChanges.subscribe(() => this.applyFilters());
    this.statutFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  private loadData(): void {
    this.communicationService.getAll().subscribe((communications) => {
      this.communications.set(communications);
      this.filteredCommunications.set(communications);
      this.loading.set(false);
    });
  }

  private applyFilters(): void {
    const search = this.searchControl.value?.toLowerCase() || '';
    const type = this.typeFilter.value;
    const statut = this.statutFilter.value;

    const filtered = this.communications().filter((c) => {
      const matchesSearch =
        !search ||
        c.titre.toLowerCase().includes(search) ||
        c.contenu.toLowerCase().includes(search);
      const matchesType = !type || c.typeCommunication === type;
      const matchesStatut = !statut || c.statut === statut;
      return matchesSearch && matchesType && matchesStatut;
    });

    this.filteredCommunications.set(filtered);
  }

  openModal(communication?: Communication): void {
    this.editingCommunication.set(communication || null);
    if (communication) {
      this.form.patchValue(communication);
    } else {
      this.form.reset({ typeCommunication: 'INFO', statut: 'BROUILLON' });
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingCommunication.set(null);
    this.form.reset();
  }

  saveCommunication(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const value = this.form.value;

    if (this.editingCommunication()) {
      const update = { ...this.editingCommunication()!, ...value };
      this.communicationService.update(update as any).subscribe((result) => {
        this.saving.set(false);
        if (result) {
          this.notificationService.success('Communication modifiée');
          this.loadData();
          this.closeModal();
        } else {
          this.notificationService.error('Erreur lors de la modification');
        }
      });
    } else {
      this.communicationService.create(value as any).subscribe((result) => {
        this.saving.set(false);
        if (result) {
          this.notificationService.success('Communication créée');
          this.loadData();
          this.closeModal();
        } else {
          this.notificationService.error('Erreur lors de la création');
        }
      });
    }
  }

  deleteCommunication(communication: Communication): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer la communication',
        message: `Voulez-vous vraiment supprimer "${communication.titre}" ?`,
        confirmText: 'Supprimer',
        type: 'danger',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.communicationService.delete(communication.id).subscribe((success) => {
          if (success) {
            this.notificationService.success('Communication supprimée');
            this.loadData();
          }
        });
      }
    });
  }
}
