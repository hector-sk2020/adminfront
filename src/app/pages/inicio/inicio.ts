// src/app/pages/inicio/inicio.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, DashboardStats } from '../../services/auth.service';
import { NavbarComponent } from '../../navbar/navbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, RouterModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
})
export class InicioComponent implements OnInit {
  private authService = inject(AuthService);

  // Estado del admin actual
  get admin() {
    return this.authService.currentAdmin();
  }

  // Estadísticas del dashboard
  stats: DashboardStats | null = null;
  isLoadingStats = true;
  errorLoadingStats = false;

  ngOnInit() {
    this.loadDashboardStats();
  }

  /**
   * Carga las estadísticas del dashboard
   */
  loadDashboardStats() {
    this.isLoadingStats = true;
    this.errorLoadingStats = false;

    this.authService.getDashboardStats().subscribe({
      next: (response) => {
        console.log('✅ Estadísticas cargadas:', response);
        this.stats = response.stats;
        this.isLoadingStats = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar estadísticas:', error);
        this.errorLoadingStats = true;
        this.isLoadingStats = false;
      },
    });
  }

  /**
   * Cierra la sesión del admin
   */
  logout() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      this.authService.logout().subscribe();
    }
  }

  /**
   * Calcula el porcentaje de aprobación
   */
  get tasaAprobacion(): number {
    if (!this.stats || this.stats.totalRequests === 0) return 0;
    return Math.round((this.stats.approvedRequests / this.stats.totalRequests) * 100);
  }
}
