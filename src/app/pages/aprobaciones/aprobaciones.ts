import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar';

interface Solicitud {
  id: number;
  nombreCompleto: string;
  correo: string;
  tipoPeticion: string;
  fecha: Date;
  estado: 'pendiente' | 'aprobado';
  documentos: string[];
}

@Component({
  selector: 'app-aprobaciones',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './aprobaciones.html',
  styleUrls: ['./aprobaciones.css']
})
export class AprobacionesComponent {

  constructor(private router: Router) {}

  mensaje = '';
  imagenSeleccionada: string | null = null;

  solicitudes: Solicitud[] = [
    {
      id: 1,
      nombreCompleto: 'María Hernández',
      correo: 'maria.hernandez@empresa.com',
      tipoPeticion: 'Verificación de identidad',
      fecha: new Date(),
      estado: 'pendiente',
      documentos: [
        'https://via.placeholder.com/900x550/4e342e/ffffff?text=INE+Frente',
        'https://via.placeholder.com/900x550/6f4e37/ffffff?text=INE+Reverso'
      ]
    },
    {
      id: 2,
      nombreCompleto: 'Luis Ramírez',
      correo: 'luis.ramirez@empresa.com',
      tipoPeticion: 'Acceso al panel administrativo',
      fecha: new Date(),
      estado: 'pendiente',
      documentos: [
        'https://via.placeholder.com/900x550/5d4037/ffffff?text=Identificacion',
        'https://via.placeholder.com/900x550/8d6e63/ffffff?text=Comprobante'
      ]
    }
  ];

  // ===============================
  // ACCIONES
  // ===============================

  aprobarSolicitud(solicitud: Solicitud) {
    solicitud.estado = 'aprobado';
    this.mostrarMensaje('Solicitud aprobada correctamente ✅');
  }

  rechazarSolicitud(id: number) {
    this.solicitudes = this.solicitudes.filter(s => s.id !== id);
    this.mostrarMensaje('Solicitud rechazada ❌');
  }

  // ===============================
  // MODAL DE IMÁGENES
  // ===============================

  abrirImagen(img: string) {
    this.imagenSeleccionada = img;
  }

  cerrarImagen() {
    this.imagenSeleccionada = null;
  }

  // cerrar con ESC
  @HostListener('document:keydown.escape')
  cerrarConEsc() {
    this.cerrarImagen();
  }

  // ===============================
  // UTILIDADES
  // ===============================

  mostrarMensaje(texto: string) {
    this.mensaje = texto;
    setTimeout(() => this.mensaje = '', 3000);
  }

  volverInicio() {
    this.router.navigate(['/inicio']);
  }
}
