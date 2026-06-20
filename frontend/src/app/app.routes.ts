import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { guestGuard } from './core/guards/guest.guard';

// Layouts
import { MainLayoutComponent } from './layouts/main';
import { AuthLayoutComponent } from './layouts/auth';

// Auth
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';

// Dashboards
import { AdminDashboardComponent } from './pages/dashboard/admin/admin-dashboard/admin-dashboard.component';
import { EnseignantDashboardComponent } from './pages/dashboard/enseignant/enseignant-dashboard/enseignant-dashboard.component';
import { EtudiantDashboardComponent } from './pages/dashboard/etudiant/etudiant-dashboard/etudiant-dashboard.component';

// CRUD Pages
import { EtudiantsListComponent } from './pages/etudiants/etudiants-list/etudiants-list.component';
import { EnseignantsListComponent } from './pages/enseignants/enseignants-list/enseignants-list.component';
import { FormationsListComponent } from './pages/formations/formations-list/formations-list.component';
import { CoursListComponent } from './pages/cours/cours-list/cours-list.component';
import { InscriptionsListComponent } from './pages/inscriptions/inscriptions-list/inscriptions-list.component';
import { CommunicationsListComponent } from './pages/communications/communications-list/communications-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  },
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      },
      {
        path: 'etudiants',
        component: EtudiantsListComponent,
      },
      {
        path: 'enseignants',
        component: EnseignantsListComponent,
      },
      {
        path: 'formations',
        component: FormationsListComponent,
      },
      {
        path: 'cours',
        component: CoursListComponent,
      },
      {
        path: 'inscriptions',
        component: InscriptionsListComponent,
      },
      {
        path: 'communications',
        component: CommunicationsListComponent,
      },
    ],
  },
  {
    path: 'enseignant',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard(['ENSEIGNANT'])],
    children: [
      {
        path: '',
        component: EnseignantDashboardComponent,
      },
      {
        path: 'formations',
        component: FormationsListComponent,
      },
      {
        path: 'cours',
        component: CoursListComponent,
      },
      {
        path: 'communications',
        component: CommunicationsListComponent,
      },
    ],
  },
  {
    path: 'etudiant',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard(['ETUDIANT'])],
    children: [
      {
        path: '',
        component: EtudiantDashboardComponent,
      },
      {
        path: 'formations',
        component: FormationsListComponent,
      },
      {
        path: 'cours',
        component: CoursListComponent,
      },
      {
        path: 'inscriptions',
        component: InscriptionsListComponent,
      },
      {
        path: 'communications',
        component: CommunicationsListComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
