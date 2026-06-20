import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { CoursService } from '../../../core/services/cours.service';
import { FormationService } from '../../../core/services/formation.service';
import { EnseignantService } from '../../../core/services/enseignant.service';
import { NotificationService } from '../../../core/services/notification.service';
import { EmptyStateComponent } from '../../../shared/components';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Cours } from '../../../core/models';

@Component({
  selector: 'app-cours-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EmptyStateComponent],
  template: `
<div class="space-y-6">

  <!-- HEADER -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-2xl font-bold">Cours</h1>
      <p class="text-gray-500">Gestion des cours</p>
    </div>

    <button (click)="openModal()" class="btn-primary">
      + Nouveau cours
    </button>
  </div>

  <!-- FILTER -->
  <div class="card flex gap-3">

    <input
      class="input-field flex-1"
      placeholder="Recherche nom / code"
      (input)="onSearch($event)"
    />

    <select class="input-field w-48" (change)="onType($event)">
      <option value="">Tous</option>
      <option value="COURS">COURS</option>
      <option value="TD">TD</option>
      <option value="TP">TP</option>
      <option value="MIXTE">MIXTE</option>
    </select>

    <select class="input-field w-64" (change)="onFormation($event)">
      <option value="">Formations</option>
      @for (f of formations(); track f.id) {
        <option [value]="f.id">{{ f.nom }}</option>
      }
    </select>

  </div>

  <!-- TABLE -->
  <div class="card p-0">

    @if (loading()) {
      <div class="p-6 text-center">Chargement...</div>
    }

    @else if (filteredCours().length === 0) {
      <app-empty-state icon="menu_book" title="Aucun cours" message="Aucun résultat"/>
    }

    @else {
      <table class="w-full">

        <thead class="bg-gray-50">
          <tr>
            <th class="p-4 text-left">Cours</th>
            <th>Type</th>
            <th>Formation</th>
            <th>Enseignant</th>
            <th>Détails</th>
            <th class="text-right p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          @for (c of filteredCours(); track c.id) {
            <tr class="border-t hover:bg-gray-50">

              <td class="p-4 font-medium">
                <div>
                  <div>{{ c.nom }}</div>
                  <small class="text-gray-500">{{ c.code }}</small>
                </div>
              </td>

              <td>{{ c.typeCours }}</td>
              <td>{{ c.formation.nom || '-' }}</td>
              <td>{{ c.enseignant?.prenom }} {{ c.enseignant?.nom }}</td>
              <td>{{ c.dureeHeures }}h / {{ c.credits }} crédits</td>

              <td class="text-right p-4">
                <button (click)="openModal(c)" class="mr-2">✏️</button>
                <button (click)="delete(c)">🗑️</button>
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
        {{ editing() ? 'Modifier cours' : 'Nouveau cours' }}
      </h2>

      <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">

        <input formControlName="code" class="input-field" placeholder="Code" />
        <input formControlName="nom" class="input-field" placeholder="Nom" />
        <textarea formControlName="description" class="input-field"></textarea>

        <div class="grid grid-cols-2 gap-2">
          <input formControlName="credits" type="number" class="input-field" />
          <input formControlName="dureeHeures" type="number" class="input-field" />
        </div>

        <select formControlName="typeCours" class="input-field">
          <option value="COURS">COURS</option>
          <option value="TD">TD</option>
          <option value="TP">TP</option>
          <option value="MIXTE">MIXTE</option>
        </select>

        <select formControlName="formationId" class="input-field">
          <option value="">Formation</option>
          @for (f of formations(); track f.id) {
            <option [value]="f.id">{{ f.nom }}</option>
          }
        </select>

        <select formControlName="enseignantId" class="input-field">
          <option value="">Enseignant</option>
          @for (e of enseignants(); track e.id) {
            <option [value]="e.id">{{ e.prenom }} {{ e.nom }}</option>
          }
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
  `
})
export class CoursListComponent implements OnInit {

  private coursService = inject(CoursService);
  private formationService = inject(FormationService);
  private enseignantService = inject(EnseignantService);
  private notification = inject(NotificationService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);

  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);

  editing = signal<Cours | null>(null);

  cours = signal<Cours[]>([]);
  filteredCours = signal<Cours[]>([]);
  formations = signal<any[]>([]);
  enseignants = signal<any[]>([]);

  searchText = '';
  typeFilter = '';
  formationFilter = '';

  form = this.fb.group({
    code: ['', Validators.required],
    nom: ['', Validators.required],
    description: [''],
    credits: [0, Validators.required],
    dureeHeures: [0, Validators.required],
    typeCours: ['COURS', Validators.required],
    formationId: ['', Validators.required],
    enseignantId: [''],
  });

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading.set(true);

    this.formationService.getAll().subscribe(f => this.formations.set(f));
    this.enseignantService.getAll().subscribe(e => this.enseignants.set(e));

    this.reload();
  }

  reload() {
    this.coursService.getAll().subscribe(data => {
      this.cours.set(data);
      this.filteredCours.set(data);
      this.loading.set(false);
    });
  }

  // FILTER
  onSearch(e: any) {
    this.searchText = e.target.value.toLowerCase();
    this.applyFilter();
  }

  onType(e: any) {
    this.typeFilter = e.target.value;
    this.applyFilter();
  }

  onFormation(e: any) {
    this.formationFilter = e.target.value;
    this.applyFilter();
  }

  applyFilter() {
    this.filteredCours.set(
      this.cours().filter(c =>
        (!this.searchText ||
          c.nom.toLowerCase().includes(this.searchText) ||
          c.code.toLowerCase().includes(this.searchText)
        ) &&
        (!this.typeFilter || c.typeCours === this.typeFilter) &&
        (!this.formationFilter || c.formation?.id === this.formationFilter)
      )
    );
  }

  openModal(c?: Cours) {
    this.editing.set(c || null);

    if (c) {
      this.form.patchValue({
        code: c.code,
        nom: c.nom,
        description: c.description,
        credits: c.credits,
        dureeHeures: c.dureeHeures,
        typeCours: c.typeCours,
        formationId: c.formation?.id || '',
        enseignantId: c.enseignant?.id || '',
      });
    } else {
      this.form.reset({ typeCours: 'COURS', credits: 0, dureeHeures: 0 });
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

    const v = this.form.getRawValue();

    // 🔥 FIX IMPORTANT (typeCours CLEAN)
    const payload = {
      code: v.code?.trim(),
      nom: v.nom?.trim(),
      description: v.description || '',
      credits: Number(v.credits),
      dureeHeures: Number(v.dureeHeures),
      typeCours: (v.typeCours ?? '').toString().trim().toUpperCase(),
      formationId: v.formationId || null,
      enseignantId: v.enseignantId || null,
    };

    const edit = this.editing();

    if (!edit) {
      this.coursService.create(payload as any).subscribe({
        next: () => {
          this.notification.success('Cours créé');
          this.reload();
          this.close();
        },
        error: err => console.error(err),
        complete: () => this.saving.set(false),
      });
      return;
    }

    this.coursService.update(edit.id, payload as any).subscribe({
      next: () => {
        this.notification.success('Cours modifié');
        this.reload();
        this.close();
      },
      error: err => console.error(err),
      complete: () => this.saving.set(false),
    });
  }

  delete(c: Cours) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer',
        message: `Supprimer ${c.nom} ?`,
        confirmText: 'Supprimer',
        type: 'danger',
      },
    }).afterClosed().subscribe(ok => {
      if (ok) {
        this.coursService.delete(c.id).subscribe(() => {
          this.notification.success('Supprimé');
          this.reload();
        });
      }
    });
  }
}