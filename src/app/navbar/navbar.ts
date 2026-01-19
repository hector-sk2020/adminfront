import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  menuOpen = false;

  constructor(public router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  irAInicio() {
    this.router.navigate(['/inicio']);
    this.closeMenu();
  }

  irAAprobaciones() {
    this.router.navigate(['/aprobaciones']);
    this.closeMenu();
  }

  logout() {
    console.log('Logout ejecutado');
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  // 👇 Esto sirve para marcar el link activo
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
