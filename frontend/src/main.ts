import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { App } from './app/app';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { API_BASE_URL } from './app/core/models/api.models';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    {
      provide: API_BASE_URL,
      useValue: 'http://localhost:8080',
    },
    importProvidersFrom(
      MatDialogModule,
      MatSnackBarModule,
      MatButtonModule,
      MatInputModule,
      MatSelectModule,
      MatTableModule,
      MatPaginatorModule,
      MatSortModule,
      MatCardModule,
      MatIconModule,
      MatToolbarModule,
      MatSidenavModule,
      MatListModule,
      MatMenuModule,
      MatTooltipModule,
      MatProgressSpinnerModule,
      MatChipsModule,
      MatDividerModule,
      MatCheckboxModule,
      MatDatepickerModule,
      MatNativeDateModule
    ),
  ],
}).catch((err) => console.error(err));
