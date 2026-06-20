import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { ToastContainerComponent } from '../../../shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent, ToastContainerComponent],
  template: `
    <div class="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <app-topbar></app-topbar>
      <app-sidebar></app-sidebar>
      <main
        class="pt-16 min-h-screen transition-all duration-300 ease-in-out"
        [class.ml-64]="true"
        [class.ml-20]="false"
      >
        <div class="p-6">
          <router-outlet></router-outlet>
        </div>
      </main>
      <app-toast-container></app-toast-container>
    </div>
  `,
})
export class MainLayoutComponent {}
