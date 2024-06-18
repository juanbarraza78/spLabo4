import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-registro',
  standalone: true,
  imports: [],
  templateUrl: './nav-registro.component.html',
  styleUrl: './nav-registro.component.css',
})
export class NavRegistroComponent {
  reuter = inject(Router);

  cambiarResultado(resultado: string) {
    if (resultado == 'paciente') {
      this.reuter.navigateByUrl('/registerPacientes');
    } else if (resultado == 'especialista') {
      this.reuter.navigateByUrl('/registerEspecialistas');
    }
  }
}
