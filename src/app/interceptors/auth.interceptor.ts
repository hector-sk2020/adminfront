// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor HTTP para el panel de administrador (Versión Funcional)
 *
 * Funciones:
 * 1. Agregar withCredentials: true a todas las peticiones
 * 2. Manejar errores de autenticación (401)
 * 3. Redirigir al login si la sesión expiró
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Clonar la petición para agregar withCredentials
  const clonedRequest = req.clone({
    withCredentials: true, // Enviar cookies automáticamente
  });

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si es error 401 (No autorizado), redirigir al login
      if (error.status === 401) {
        console.warn('⚠️ Sesión expirada o no autorizado - Redirigiendo al login');
        router.navigate(['/login']);
      }

      // Si es error 403 (Prohibido), mostrar mensaje
      if (error.status === 403) {
        console.error('❌ Acceso prohibido - Permisos insuficientes');
        alert('No tienes permisos para realizar esta acción');
      }

      // Propagar el error
      return throwError(() => error);
    }),
  );
};
