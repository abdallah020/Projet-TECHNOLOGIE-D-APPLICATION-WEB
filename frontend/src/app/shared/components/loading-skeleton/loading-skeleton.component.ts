import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-pulse space-y-4">
      @for (i of countArray; track i) {
        <div class="flex items-center gap-4">
          <div class="h-12 w-12 rounded-lg bg-secondary-200 dark:bg-secondary-700"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4"></div>
            <div class="h-3 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2"></div>
          </div>
        </div>
      }
    </div>
  `,
})
export class LoadingSkeletonComponent {
  count = input<number>(5);

  get countArray(): number[] {
    return Array(this.count()).fill(0);
  }
}
