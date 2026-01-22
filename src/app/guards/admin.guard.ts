// src/app/guards/admin.guard.ts
import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateFn,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ✨ Verificar SOLO el estado local (signal)
  const currentAdmin = authService.currentAdmin();
  const isAuthenticated = authService.isAuthenticated();

  console.log('🔍 Guard verificando:', {
    currentAdmin,
    isAuthenticated,
    isActive: currentAdmin?.isActive,
  });

  if (currentAdmin && isAuthenticated && currentAdmin.isActive) {
    console.log('✅ Admin autenticado - Acceso permitido');
    return true;
  }

  console.warn('⚠️ Sin autenticación - Redirigiendo al login');
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};
