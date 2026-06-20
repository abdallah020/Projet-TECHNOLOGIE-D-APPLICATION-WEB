import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtudiantService } from '../../../../core/services/etudiant.service';
import { EnseignantService } from '../../../../core/services/enseignant.service';
import { FormationService } from '../../../../core/services/formation.service';
import { CommunicationService } from '../../../../core/services/communication.service';
import { InscriptionService } from '../../../../core/services/inscription.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-secondary-900 dark:text-white">
            Tableau de bord
          </h1>
          <p class="text-secondary-500 dark:text-secondary-400">
            Vue d'ensemble du système universitaire
          </p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Etudiants -->
        <div class="stat-card">
          <div class="stat-icon bg-primary-100 dark:bg-primary-900/30">
            <span class="material-icons text-primary-600 dark:text-primary-400">
              school
            </span>
          </div>
          <div>
            <p class="text-2xl font-bold text-secondary-900 dark:text-white">
              {{ stats().totalEtudiants }}
            </p>
            <p class="text-sm text-secondary-500 dark:text-secondary-400">
              Étudiants
            </p>
          </div>
        </div>

        <!-- Enseignants -->
        <div class="stat-card">
          <div class="stat-icon bg-accent-100 dark:bg-accent-900/30">
            <span class="material-icons text-accent-600 dark:text-accent-400">
              person
            </span>
          </div>
          <div>
            <p class="text-2xl font-bold text-secondary-900 dark:text-white">
              {{ stats().totalEnseignants }}
            </p>
            <p class="text-sm text-secondary-500 dark:text-secondary-400">
              Enseignants
            </p>
          </div>
        </div>

        <!-- Formations -->
        <div class="stat-card">
          <div class="stat-icon bg-yellow-100 dark:bg-yellow-900/30">
            <span class="material-icons text-yellow-600 dark:text-yellow-400">
              workspace_premium
            </span>
          </div>
          <div>
            <p class="text-2xl font-bold text-secondary-900 dark:text-white">
              {{ stats().totalFormations }}
            </p>
            <p class="text-sm text-secondary-500 dark:text-secondary-400">
              Formations
            </p>
          </div>
        </div>

        <!-- Communications -->
        <div class="stat-card">
          <div class="stat-icon bg-purple-100 dark:bg-purple-900/30">
            <span class="material-icons text-purple-600 dark:text-purple-400">
              campaign
            </span>
          </div>
          <div>
            <p class="text-2xl font-bold text-secondary-900 dark:text-white">
              {{ stats().totalCommunications }}
            </p>
            <p class="text-sm text-secondary-500 dark:text-secondary-400">
              Communications
            </p>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Etudiants par Formation -->
        <div class="card">
          <h3 class="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Répartition des étudiants
          </h3>
          <div class="space-y-3">
            @for (item of etudiantsParFormation(); track item.formation) {
              <div class="flex items-center gap-3">
                <div class="flex-1">
                  <div class="flex justify-between mb-1">
                    <span class="text-sm text-secondary-600 dark:text-secondary-300">{{ item.formation }}</span>
                    <span class="text-sm font-medium text-secondary-900 dark:text-white">{{ item.count }}</span>
                  </div>
                  <div class="h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                    <div class="h-full bg-primary-500 rounded-full"
                         [style.width.%]="item.percentage"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Inscriptions par statut -->
        <div class="card">
          <h3 class="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
            Statut des inscriptions
          </h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <p class="text-3xl font-bold text-green-600">{{ inscriptionsStats().validees }}</p>
              <p class="text-sm text-secondary-600 dark:text-secondary-400">Validées</p>
            </div>
            <div class="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <p class="text-3xl font-bold text-yellow-600">{{ inscriptionsStats().enAttente }}</p>
              <p class="text-sm text-secondary-600 dark:text-secondary-400">En attente</p>
            </div>
            <div class="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <p class="text-3xl font-bold text-red-600">{{ inscriptionsStats().rejetees }}</p>
              <p class="text-sm text-secondary-600 dark:text-secondary-400">Rejetées</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Inscriptions -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-secondary-900 dark:text-white">
            Inscriptions récentes
          </h3>
          <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700
                       dark:text-primary-300 rounded-full text-sm font-medium">
            {{ stats().inscriptionsRecentes }} nouvelles
          </span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-secondary-200 dark:border-secondary-700">
                <th class="text-left py-3 px-4 text-sm font-medium text-secondary-500">Étudiant</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-secondary-500">Formation</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-secondary-500">Statut</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-secondary-500">Date</th>
              </tr>
            </thead>
            <tbody>
              @for (inscription of recentInscriptions(); track inscription.id) {
                <tr class="border-b border-secondary-100 dark:border-secondary-700 last:border-0
                           hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full
                                  flex items-center justify-center">
                        <span class="text-xs font-medium text-primary-600 dark:text-primary-400">
                          {{ inscription.etudiantPrenom[0] }}{{ inscription.etudiantNom[0] }}
                        </span>
                      </div>
                      <span class="text-sm font-medium text-secondary-900 dark:text-white">
                        {{ inscription.etudiantPrenom }} {{ inscription.etudiantNom }}
                      </span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-sm text-secondary-600 dark:text-secondary-300">
                    {{ inscription.formationNom }}
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 rounded-full text-xs font-medium"
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
                  <td class="py-3 px-4 text-sm text-secondary-500">
                    {{ inscription.dateInscription | date:'dd/MM/yyyy' }}
                  </td>
                </tr>
              }
              @if (recentInscriptions().length === 0) {
                <tr>
                  <td colspan="4" class="py-8 text-center text-secondary-500">
                    Aucune inscription récente
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private readonly etudiantService = inject(EtudiantService);
  private readonly enseignantService = inject(EnseignantService);
  private readonly formationService = inject(FormationService);
  private readonly communicationService = inject(CommunicationService);
  private readonly inscriptionService = inject(InscriptionService);

  stats = signal({
    totalEtudiants: 0,
    totalEnseignants: 0,
    totalFormations: 0,
    totalCommunications: 0,
    inscriptionsRecentes: 0,
  });

  etudiantsParFormation = signal<{formation: string; count: number; percentage: number}[]>([]);
  inscriptionsStats = signal({ validees: 0, enAttente: 0, rejetees: 0 });
  recentInscriptions = signal<any[]>([]);

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.etudiantService.getAll().subscribe((etudiants) => {
      this.stats.update((s) => ({ ...s, totalEtudiants: etudiants.length }));
    });

    this.enseignantService.getAll().subscribe((enseignants) => {
      this.stats.update((s) => ({ ...s, totalEnseignants: enseignants.length }));
    });

    this.formationService.getAll().subscribe((formations) => {
      this.stats.update((s) => ({ ...s, totalFormations: formations.length }));
    });

    this.communicationService.getAll().subscribe((communications) => {
      this.stats.update((s) => ({ ...s, totalCommunications: communications.length }));
    });

    this.inscriptionService.getAll().subscribe((inscriptions) => {
      const recentes = inscriptions.filter((i) => i.statut === 'EN_ATTENTE' || i.statut === 'INSCRIT');
      this.stats.update((s) => ({ ...s, inscriptionsRecentes: recentes.length }));
      this.recentInscriptions.set(inscriptions.slice(0, 5));

      const validees = inscriptions.filter((i) => i.statut === 'VALIDÉ').length;
      const enAttente = inscriptions.filter((i) => i.statut === 'EN_ATTENTE').length;
      const rejetees = inscriptions.filter((i) => i.statut === 'REJETÉ').length;
      this.inscriptionsStats.set({ validees, enAttente, rejetees });
    });
  }
}
