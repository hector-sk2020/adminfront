// src/app/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

// ========== INTERFACES ==========

export interface Admin {
  id: number;
  email: string;
  fullName: string;
  role: 'super_admin' | 'admin';
  isActive: boolean;
}

export interface AdminAuthResponse {
  success: boolean;
  message: string;
  admin: Admin;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalBuyers: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalRequests: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  stats: DashboardStats;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  isSeller: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  count: number;
  users: User[];
}

export interface AdminsResponse {
  success: boolean;
  count: number;
  admins: Admin[];
}

// ========== SERVICIO ==========

/**
 * Servicio de Autenticación para Administradores
 *
 * Maneja:
 * - Login de admin (cookie: admin_token)
 * - Verificación de sesión
 * - Logout
 * - Estado reactivo del admin actual
 * - Estadísticas del dashboard
 * - Gestión de usuarios y admins
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/admin`;

  /**
   * Estado reactivo del admin actual
   */
  currentAdmin = signal<Admin | null>(null);

  /**
   * Estado reactivo de autenticación
   */
  isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    /**
     * Verificar sesión en background al cargar la app
     */
    this.checkAuthInBackground();
  }

  /**
   * Verifica sesión en background (sin bloquear)
   */
  private checkAuthInBackground(): void {
    this.getProfile()
      .pipe(
        catchError(() => {
          // No hay sesión válida, estado permanece en false
          return of(null);
        }),
      )
      .subscribe({
        next: (response) => {
          if (response && response.admin) {
            console.log('✅ Sesión de admin restaurada:', response.admin.email);
            this.currentAdmin.set(response.admin);
            this.isAuthenticated.set(true);
          }
        },
      });
  }

  /**
   * Login de administrador
   *
   * POST /admin/login
   * Cookie: admin_token (HTTP-Only)
   */
  login(credentials: AdminLoginRequest): Observable<AdminAuthResponse> {
    return this.http
      .post<AdminAuthResponse>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response.success && response.admin) {
            console.log('✅ Admin login exitoso:', response.admin);

            // ✨ IMPORTANTE: Actualizar estado INMEDIATAMENTE
            this.currentAdmin.set(response.admin);
            this.isAuthenticated.set(true);

            console.log('🔄 Estado actualizado:', {
              admin: this.currentAdmin(),
              isAuth: this.isAuthenticated(),
            });
          }
        }),
      );
  }
  /**
   * Obtiene el perfil del admin autenticado
   *
   * GET /admin/profile
   */
  getProfile(): Observable<{ success: boolean; admin: Admin } | null> {
    return this.http
      .get<{ success: boolean; admin: Admin }>(`${this.apiUrl}/profile`, { withCredentials: true })
      .pipe(
        tap((response) => {
          if (response && response.admin) {
            this.currentAdmin.set(response.admin);
            this.isAuthenticated.set(true);
          }
        }),
        catchError(() => {
          // No hay sesión válida
          this.currentAdmin.set(null);
          this.isAuthenticated.set(false);
          return of(null);
        }),
      );
  }

  /**
   * Cierra la sesión del admin
   *
   * POST /admin/logout
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        console.log('✅ Sesión de admin cerrada');
        this.currentAdmin.set(null);
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        // Aunque falle, limpiar estado local
        console.error('Error al cerrar sesión:', error);
        this.currentAdmin.set(null);
        this.isAuthenticated.set(false);
        this.router.navigate(['/login']);
        return of(null);
      }),
    );
  }

  /**
   * Verifica si el admin actual es super admin
   */
  isSuperAdmin(): boolean {
    return this.currentAdmin()?.role === 'super_admin';
  }

  /**
   * Verifica si el admin actual está activo
   */
  isActive(): boolean {
    return this.currentAdmin()?.isActive ?? false;
  }

  // ========== MÉTODOS DE DASHBOARD ==========

  /**
   * Obtiene las estadísticas del dashboard
   *
   * GET /admin/dashboard/stats
   */
  getDashboardStats(): Observable<DashboardStatsResponse> {
    return this.http.get<DashboardStatsResponse>(`${this.apiUrl}/dashboard/stats`, {
      withCredentials: true,
    });
  }

  /**
   * Obtiene todos los usuarios
   *
   * GET /admin/users
   */
  getAllUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/users`, { withCredentials: true });
  }

  /**
   * Obtiene todos los administradores (solo super_admin)
   *
   * GET /admin/admins
   */
  getAllAdmins(): Observable<AdminsResponse> {
    return this.http.get<AdminsResponse>(`${this.apiUrl}/admins`, { withCredentials: true });
  }

  /**
   * Crea un nuevo administrador (solo super_admin)
   *
   * POST /admin/admins
   */
  createAdmin(data: {
    email: string;
    password: string;
    fullName: string;
    role: 'admin' | 'super_admin';
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/admins`, data, { withCredentials: true });
  }

  /**
   * Actualiza un administrador (solo super_admin)
   *
   * PATCH /admin/admins/:id
   */
  updateAdmin(
    id: number,
    data: {
      email?: string;
      fullName?: string;
      role?: 'admin' | 'super_admin';
      isActive?: boolean;
    },
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admins/${id}`, data, { withCredentials: true });
  }
}
