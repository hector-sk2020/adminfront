import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar'; // Ajusta ruta según tu proyecto

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent {

  constructor(private router: Router) {}

  // Formulario para agregar nuevo usuario
  nuevoUsuario = { nombre: '', email: '', rol: 'Usuario', aprobado: false };

  // Usuarios ya existentes
  usuarios: any[] = [
    { id: 1, nombre: 'Juan Pérez', email: 'juan@mail.com', rol: 'Usuario', aprobado: true },
    { id: 2, nombre: 'Ana Gómez', email: 'ana@mail.com', rol: 'Admin', aprobado: false },
    { id: 3, nombre: 'Carlos Ruiz', email: 'carlos@mail.com', rol: 'Usuario', aprobado: true },
  ];

  // Verificaciones pendientes
  verificaciones: any[] = [
    { id: 1, tipo: 'Alta de usuario', usuario: 'Ana Gómez', fecha: new Date() },
    { id: 2, tipo: 'Cambio de rol', usuario: 'Carlos Ruiz', fecha: new Date() },
    { id: 3, tipo: 'verificacion', usuario: 'juan rasputia', fecha: new Date() }

  ];



  eliminarUsuario(id: number) {
    this.usuarios = this.usuarios.filter(u => u.id !== id);
  }

  irAVerificaciones() {
    this.router.navigate(['/aprobaciones']);
  }


}
