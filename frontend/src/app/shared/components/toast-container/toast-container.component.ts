import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      @for (toast of notificationService.toasts(); track toast.id) {
        <div
          class="animate-fade-in px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
          [class.bg-green-500]="toast.type === 'success'"
          [class.bg-red-500]="toast.type === 'error'"
          [class.bg-yellow-500]="toast.type === 'warning'"
          [class.bg-blue-500]="toast.type === 'info'"
          [class.text-white]="true"
        >
          <span class="flex-1">{{ toast.message }}</span>
          <button
            (click)="notificationService.dismiss(toast.id)"
            class="text-white/80 hover:text-white"
          >
            <span class="material-icons text-sm">close</span>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  notificationService = inject(NotificationService);
}
