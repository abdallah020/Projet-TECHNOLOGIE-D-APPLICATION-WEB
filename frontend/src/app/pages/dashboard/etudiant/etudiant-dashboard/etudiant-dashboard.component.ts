import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormationService } from '../../../../core/services/formation.service';
import { CoursService } from '../../../../core/services/cours.service';
import { CommunicationService } from '../../../../core/services/communication.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-etudiant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-secondary-900 dark:text-white">
            Tableau de bord Étudiant
          </h1>
          <p class="text-secondary-500 dark:text-secondary-400">
            Bienvenue, {{ authService.currentUser()?.prenom }}
          </p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div class="stat-card">
          <div class="stat-icon bg-primary-100 dark:bg-primary-900/30">
            <span class="material-icons text-primary-600">menu_book</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-secondary-900 dark:text-white">
              {{ formations().length }}
            </p>
            <p class="text-sm text-secondary-500">Formations disponibles</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-accent-100 dark:bg-accent-900/30">
            <span class="material-icons text-accent-600">school</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-secondary-900 dark:text-white">
              {{ cours().length }}
            </p>
            <p class="text-sm text-secondary-500">Cours disponibles</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-yellow-100 dark:bg-yellow-900/30">
            <span class="material-icons text-yellow-600">campaign</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-secondary-900 dark:text-white">
              {{ communicationsPubliees() }}
            </p>
            <p class="text-sm text-secondary-500">Communications</p>
          </div>
        </div>
      </div>

      <!-- Available Formations -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-secondary-900 dark:text-white">
            Formations disponibles
          </h3>
          <a routerLink="/formations" class="text-primary-600 text-sm font-medium hover:underline">
            Voir tout
          </a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (formation of formations().slice(0, 3); track formation.id) {
            <div class="p-4 rounded-lg border border-secondary-200 dark:border-secondary-700
                        bg-gradient-to-br from-white to-secondary-50 dark:from-secondary-800
                        dark:to-secondary-700 hover:shadow-card-hover transition-all">
              <div class="flex items-start justify-between mb-2">
                <span class="px-2 py-1 rounded text-xs font-medium bg-primary-100
                             text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                  {{ formation.niveau }}
                </span>
                <span class="text-xs px-2 py-1 rounded-full"
                      [class.bg-green-100]="formation.statut === 'EN_COURS'"
                      [class.text-green-700]="formation.statut === 'EN_COURS'"
                      [class.bg-yellow-100]="formation.statut === 'PLANIFIÉE'"
                      [class.text-yellow-700]="formation.statut === 'PLANIFIÉE'">
                  {{ formation.statut }}
                </span>
              </div>
              <h4 class="font-medium text-secondary-900 dark:text-white mb-1">
                {{ formation.nom }}
              </h4>
              <p class="text-xs text-secondary-500 mb-2">{{ formation.code }}</p>
              <div class="text-sm text-secondary-600 dark:text-secondary-400">
                <span>{{ formation.dateDebut | date:'MMM yyyy' }} - {{ formation.dateFin | date:'MMM yyyy' }}</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Recent Communications -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-secondary-900 dark:text-white">
            Communications récentes
          </h3>
          <a routerLink="/communications" class="text-primary-600 text-sm font-medium hover:underline">
            Voir tout
          </a>
        </div>
        <div class="space-y-3">
          @for (comm of communications().slice(0, 5); track comm.id) {
            <div class="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary-50
                        dark:hover:bg-secondary-700/50 transition-colors">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                   [class.bg-blue-100]="comm.typeCommunication === 'INFO'"
                   [class.text-blue-600]="comm.typeCommunication === 'INFO'"
                   [class.bg-purple-100]="comm.typeCommunication === 'REUNION'"
                   [class.text-purple-600]="comm.typeCommunication === 'REUNION'">
                <span class="material-icons text-lg">
                  {{ comm.typeCommunication === 'REUNION' ? 'event' : 'info' }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-secondary-900 dark:text-white truncate">
                  {{ comm.titre }}
                </h4>
                <p class="text-sm text-secondary-500 truncate">
                  {{ comm.contenu }}
                </p>
                <p class="text-xs text-secondary-400 mt-1">
                  Par {{ comm.auteurNom }} - {{ comm.dateCreation | date:'dd/MM/yyyy' }}
                </p>
              </div>
            </div>
          }
          @if (communications().length === 0) {
            <div class="py-8 text-center text-secondary-500">
              Aucune communication récente
            </div>
          }
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <a routerLink="/formations"
           class="card-hover flex flex-col items-center gap-2 py-6">
          <span class="material-icons text-primary-600 text-3xl">workspace_premium</span>
          <span class="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Voir formations
          </span>
        </a>
        <a routerLink="/cours"
           class="card-hover flex flex-col items-center gap-2 py-6">
          <span class="material-icons text-accent-600 text-3xl">menu_book</span>
          <span class="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Voir cours
          </span>
        </a>
        <a routerLink="/communications"
           class="card-hover flex flex-col items-center gap-2 py-6">
          <span class="material-icons text-yellow-600 text-3xl">campaign</span>
          <span class="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Communications
          </span>
        </a>
        <a routerLink="/inscriptions"
           class="card-hover flex flex-col items-center gap-2 py-6">
          <span class="material-icons text-purple-600 text-3xl">how_to_reg</span>
          <span class="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Mes inscriptions
          </span>
        </a>
      </div>
    </div>
  `,
})
export class EtudiantDashboardComponent implements OnInit {
  private readonly formationService = inject(FormationService);
  private readonly coursService = inject(CoursService);
  private readonly communicationService = inject(CommunicationService);
  authService = inject(AuthService);

  formations = signal<any[]>([]);
  cours = signal<any[]>([]);
  communications = signal<any[]>([]);

  communicationsPubliees = signal(0);

  ngOnInit(): void {
    this.formationService.getAll().subscribe((formations) => {
      this.formations.set(formations);
    });

    this.coursService.getAll().subscribe((cours) => {
      this.cours.set(cours);
    });

    this.communicationService.getAll().subscribe((comms) => {
      const publiees = comms.filter((c: any) => c.statut === 'PUBLIÉ');
      this.communications.set(publiees);
      this.communicationsPubliees.set(publiees.length);
    });
  }
}
