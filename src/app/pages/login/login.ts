// src/app/pages/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  onSubmit() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Por favor ingresa un email válido';
      return;
    }

    console.log('🔐 Intentando login como admin...');
    this.isLoading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso:', response);
        console.log('🔄 Estado del AuthService:', {
          admin: this.authService.currentAdmin(),
          isAuth: this.authService.isAuthenticated(),
        });

        // ✨ SOLUCIÓN: Navegar de forma síncrona
        // El estado ya está actualizado en el tap del AuthService
        this.isLoading = false;

        // Navegar inmediatamente - el guard verá el estado actualizado
        this.router.navigate(['/inicio']);
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage = 'Email o contraseña incorrectos';
        } else if (error.status === 403) {
          this.errorMessage = 'Cuenta de administrador desactivada';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar al servidor';
        } else {
          this.errorMessage = error.error?.message || 'Error al iniciar sesión';
        }
      },
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
