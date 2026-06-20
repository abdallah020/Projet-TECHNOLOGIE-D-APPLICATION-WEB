import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
        {{ data.title }}
      </h2>
      <p class="text-secondary-600 dark:text-secondary-300 mb-6">
        {{ data.message }}
      </p>
      <div class="flex justify-end gap-3">
        <button
          mat-button
          (click)="onCancel()"
          class="btn-secondary"
        >
          {{ data.cancelText || 'Annuler' }}
        </button>
        <button
          mat-flat-button
          (click)="onConfirm()"
          [class.btn-danger]="data.type === 'danger'"
          [class.btn-warning]="data.type === 'warning'"
          [class.btn-primary]="!data.type || data.type === 'info'"
        >
          {{ data.confirmText || 'Confirmer' }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmDialogComponent {
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
