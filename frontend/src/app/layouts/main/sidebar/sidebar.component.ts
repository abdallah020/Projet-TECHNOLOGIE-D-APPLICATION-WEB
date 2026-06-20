import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  path: string;
  roles?: ('ADMIN' | 'ENSEIGNANT' | 'ETUDIANT')[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside
      class="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-secondary-800
             border-r border-secondary-200 dark:border-secondary-700 z-40
             transition-all duration-300 ease-in-out overflow-y-auto"
      [class.w-64]="!collapsed()"
      [class.w-20]="collapsed()"
    >
      <div class="p-4">
        <!-- Toggle Button -->
        <button
          (click)="toggleSidebar()"
          class="w-full flex items-center justify-center p-2 rounded-lg
                 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors mb-4"
        >
          <span class="material-icons text-secondary-600 dark:text-secondary-300">
            {{ collapsed() ? 'chevron_right' : 'chevron_left' }}
          </span>
        </button>

        <!-- Navigation Items -->
        <nav class="space-y-1">
          @for (item of visibleNavItems(); track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
              [class]="navItemClass"
              class="flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-700
                     dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700
                     transition-all duration-200 relative overflow-hidden"
            >
              <span class="material-icons">{{ item.icon }}</span>
              @if (!collapsed()) {
                <span class="font-medium whitespace-nowrap">{{ item.label }}</span>
              }
            </a>
          }
        </nav>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  collapsed = signal(false);
  userRole = this.authService.userRole;

  navItems: NavItem[] = [
    { label: 'Tableau de bord', icon: 'dashboard', path: '', roles: ['ADMIN', 'ENSEIGNANT', 'ETUDIANT'] },
    { label: 'Étudiants', icon: 'school', path: '/etudiants', roles: ['ADMIN'] },
    { label: 'Enseignants', icon: 'person', path: '/enseignants', roles: ['ADMIN'] },
    { label: 'Formations', icon: 'workspace_premium', path: '/formations', roles: ['ADMIN', 'ENSEIGNANT', 'ETUDIANT'] },
    { label: 'Cours', icon: 'menu_book', path: '/cours', roles: ['ADMIN', 'ENSEIGNANT', 'ETUDIANT'] },
    { label: 'Inscriptions', icon: 'how_to_reg', path: '/inscriptions', roles: ['ADMIN', 'ETUDIANT'] },
    { label: 'Communications', icon: 'campaign', path: '/communications', roles: ['ADMIN', 'ENSEIGNANT', 'ETUDIANT'] },
  ];

  visibleNavItems = computed(() => {
    const role = this.userRole();
    return this.navItems.filter((item) => {
      if (!item.roles) return true;
      return role ? item.roles.includes(role) : false;
    }).map((item) => {
      const basePath = getBasePath(role);
      return { ...item, path: basePath + item.path };
    });
  });

  navItemClass = 'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200';

  toggleSidebar(): void {
    this.collapsed.update((v) => !v);
  }
}

function getBasePath(role: string | null): string {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'ENSEIGNANT':
      return '/enseignant';
    case 'ETUDIANT':
      return '/etudiant';
    default:
      return '';
  }
}
