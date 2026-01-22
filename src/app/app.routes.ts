// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { InicioComponent } from './pages/inicio/inicio';
import { AprobacionesComponent } from './pages/aprobaciones/aprobaciones';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [adminGuard], // ← Proteger ruta
    data: { skipAuthGuard: true }, // ← Omitir doble verificación en el guard
  },
  {
    path: 'aprobaciones',
    component: AprobacionesComponent,
    canActivate: [adminGuard], // ← Proteger ruta
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
