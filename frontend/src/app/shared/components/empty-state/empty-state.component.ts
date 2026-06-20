import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div class="w-16 h-16 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center mb-4">
        <span class="material-icons text-3xl text-secondary-400 dark:text-secondary-500">
          {{ icon() }}
        </span>
      </div>
      <h3 class="text-lg font-medium text-secondary-900 dark:text-white mb-2">
        {{ title() }}
      </h3>
      <p class="text-secondary-500 dark:text-secondary-400 max-w-sm">
        {{ message() }}
      </p>
    </div>
  `,
})
export class EmptyStateComponent {
  icon = input<string>('inbox');
  title = input<string>('Aucune donnée');
  message = input<string>('Il n\'y a pas encore de données à afficher.');
}
