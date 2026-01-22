// src/app/pages/aprobaciones/aprobaciones.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SellerRequestsService, SellerRequest } from '../../services/seller-requests.service';
import { NavbarComponent } from '../../navbar/navbar';

@Component({
  selector: 'app-aprobaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './aprobaciones.html',
  styleUrls: ['./aprobaciones.css'],
})
export class AprobacionesComponent implements OnInit {
  private sellerRequestsService = inject(SellerRequestsService);

  // Estado de las solicitudes
  solicitudes: SellerRequest[] = [];
  isLoading = true;
  errorMessage = '';

  // Filtro activo
  filtroActivo: 'all' | 'pending' | 'approved' | 'rejected' = 'pending';

  // Modal de imagen
  imagenSeleccionada: string | null = null;

  // Modal de rechazo
  mostrarModalRechazo = false;
  solicitudARevisar: SellerRequest | null = null;
  razonRechazo = '';

  // Toast
  mensaje = '';

  ngOnInit() {
    this.cargarSolicitudes();
  }

  /**
   * Carga las solicitudes del backend
   */
  cargarSolicitudes() {
    this.isLoading = true;
    this.errorMessage = '';

    this.sellerRequestsService.getRequests(this.filtroActivo).subscribe({
      next: (response) => {
        console.log('✅ Solicitudes cargadas:', response);
        this.solicitudes = response.requests;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar solicitudes:', error);
        this.errorMessage = 'Error al cargar las solicitudes';
        this.isLoading = false;
      },
    });
  }

  /**
   * Cambia el filtro y recarga
   */
  cambiarFiltro(filtro: 'all' | 'pending' | 'approved' | 'rejected') {
    this.filtroActivo = filtro;
    this.cargarSolicitudes();
  }

  /**
   * Abre el modal de imagen
   */
  abrirImagen(url: string) {
    this.imagenSeleccionada = url;
  }

  /**
   * Cierra el modal de imagen
   */
  cerrarImagen() {
    this.imagenSeleccionada = null;
  }

  /**
   * Aprobar solicitud directamente
   */
  aprobarSolicitud(solicitud: SellerRequest) {
    if (solicitud.status !== 'pending') {
      this.mostrarToast('Esta solicitud ya fue revisada');
      return;
    }

    if (!confirm(`¿Aprobar la solicitud de ${solicitud.user.fullName}?`)) {
      return;
    }

    this.sellerRequestsService
      .reviewRequest(solicitud.id, {
        status: 'approved',
      })
      .subscribe({
        next: (response) => {
          console.log('✅ Solicitud aprobada:', response);
          this.mostrarToast(`✅ Solicitud de ${solicitud.user.fullName} aprobada`);

          // Actualizar el estado local
          solicitud.status = 'approved';
          solicitud.reviewedAt = new Date();

          // Recargar después de 1 segundo
          setTimeout(() => {
            this.cargarSolicitudes();
          }, 1000);
        },
        error: (error) => {
          console.error('❌ Error al aprobar:', error);
          this.mostrarToast('❌ Error al aprobar la solicitud');
        },
      });
  }

  /**
   * Abre modal de rechazo
   */
  rechazarSolicitud(solicitud: SellerRequest) {
    if (solicitud.status !== 'pending') {
      this.mostrarToast('Esta solicitud ya fue revisada');
      return;
    }

    this.solicitudARevisar = solicitud;
    this.razonRechazo = '';
    this.mostrarModalRechazo = true;
  }

  /**
   * Confirma el rechazo con razón
   */
  confirmarRechazo() {
    if (!this.razonRechazo.trim()) {
      alert('Por favor ingresa una razón del rechazo');
      return;
    }

    if (!this.solicitudARevisar) return;

    this.sellerRequestsService
      .reviewRequest(this.solicitudARevisar.id, {
        status: 'rejected',
        rejectionReason: this.razonRechazo,
      })
      .subscribe({
        next: (response) => {
          console.log('✅ Solicitud rechazada:', response);
          this.mostrarToast(`❌ Solicitud rechazada`);

          // Cerrar modal
          this.cerrarModalRechazo();

          // Recargar después de 1 segundo
          setTimeout(() => {
            this.cargarSolicitudes();
          }, 1000);
        },
        error: (error) => {
          console.error('❌ Error al rechazar:', error);
          this.mostrarToast('Error al rechazar la solicitud');
        },
      });
  }

  /**
   * Cierra el modal de rechazo
   */
  cerrarModalRechazo() {
    this.mostrarModalRechazo = false;
    this.solicitudARevisar = null;
    this.razonRechazo = '';
  }

  /**
   * Muestra un toast temporal
   */
  private mostrarToast(texto: string) {
    this.mensaje = texto;
    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }

  /**
   * Obtiene los documentos de una solicitud
   */
  getDocumentos(solicitud: SellerRequest): string[] {
    const docs = [solicitud.ineFrontUrl];
    if (solicitud.ineBackUrl) {
      docs.push(solicitud.ineBackUrl);
    }
    return docs;
  }

  /**
   * Formatea la fecha
   */
  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Obtiene el badge de estado
   */
  getEstadoClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge-pending';
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      default:
        return '';
    }
  }

  /**
   * Obtiene el texto del estado
   */
  getEstadoTexto(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      default:
        return status;
    }
  }
}
