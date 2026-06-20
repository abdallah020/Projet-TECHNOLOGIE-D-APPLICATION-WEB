import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursService } from '../../../../core/services/cours.service';
import { CommunicationService } from '../../../../core/services/communication.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-enseignant-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-secondary-900 dark:text-white">
            Tableau de bord Enseignant
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
              {{ cours().length }}
            </p>
            <p class="text-sm text-secondary-500">Mes cours</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-accent-100 dark:bg-accent-900/30">
            <span class="material-icons text-accent-600">campaign</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-secondary-900 dark:text-white">
              {{ communications().length }}
            </p>
            <p class="text-sm text-secondary-500">Communications</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon bg-yellow-100 dark:bg-yellow-900/30">
            <span class="material-icons text-yellow-600">schedule</span>
          </div>
          <div>
            <p class="text-2xl font-bold text-secondary-900 dark:text-white">
              {{ totalHeures() }}
            </p>
            <p class="text-sm text-secondary-500">Heures totales</p>
          </div>
        </div>
      </div>

      <!-- My Courses -->
      <div class="card">
        <h3 class="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Mes cours assignés
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (cours of cours(); track cours.id) {
            <div class="p-4 rounded-lg border border-secondary-200 dark:border-secondary-700
                        hover:shadow-card-hover transition-shadow">
              <div class="flex items-start justify-between mb-2">
                <span class="px-2 py-1 rounded text-xs font-medium"
                      [class.bg-primary-100]="cours.typeCours === 'COURS'"
                      [class.text-primary-700]="cours.typeCours === 'COURS'"
                      [class.bg-accent-100]="cours.typeCours === 'TD'"
                      [class.text-accent-700]="cours.typeCours === 'TD'"
                      [class.bg-yellow-100]="cours.typeCours === 'TP'"
                      [class.text-yellow-700]="cours.typeCours === 'TP'">
                  {{ cours.typeCours }}
                </span>
                <span class="text-xs text-secondary-500">{{ cours.code }}</span>
              </div>
              <h4 class="font-medium text-secondary-900 dark:text-white mb-1">
                {{ cours.nom }}
              </h4>
              <p class="text-sm text-secondary-500 mb-2">
                {{ cours.formation?.nom || 'Formation non assignée' }}
              </p>
              <div class="flex items-center gap-4 text-sm text-secondary-600 dark:text-secondary-400">
                <span class="flex items-center gap-1">
                  <span class="material-icons text-xs">schedule</span>
                  {{ cours.dureeHeures }}h
                </span>
                <span class="flex items-center gap-1">
                  <span class="material-icons text-xs">star</span>
                  {{ cours.credits }} crédits
                </span>
              </div>
            </div>
          }
          @if (cours().length === 0) {
            <div class="col-span-full py-8 text-center text-secondary-500">
              Aucun cours assigné
            </div>
          }
        </div>
      </div>

      <!-- Recent Communications -->
      <div class="card">
        <h3 class="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Mes communications récentes
        </h3>
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
              </div>
              <span class="text-xs text-secondary-400">
                {{ comm.dateCreation | date:'dd/MM' }}
              </span>
            </div>
          }
          @if (communications().length === 0) {
            <div class="py-8 text-center text-secondary-500">
              Aucune communication
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class EnseignantDashboardComponent implements OnInit {
  private readonly coursService = inject(CoursService);
  private readonly communicationService = inject(CommunicationService);
  authService = inject(AuthService);

  cours = signal<any[]>([]);
  communications = signal<any[]>([]);

  totalHeures = signal(0);

  ngOnInit(): void {
    this.coursService.getAll().subscribe((cours) => {
      this.cours.set(cours);
      const total = cours.reduce((sum, c) => sum + c.dureeHeures, 0);
      this.totalHeures.set(total);
    });

    this.communicationService.getAll().subscribe((comms) => {
      this.communications.set(comms);
    });
  }
}
