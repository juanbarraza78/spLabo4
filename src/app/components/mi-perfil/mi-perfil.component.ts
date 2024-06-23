import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
})
export class MiPerfilComponent {
  authService = inject(FirebaseAuthService);

  usuarioActual: any;

  ngOnInit(): void {
    setTimeout(() => {
      this.authService
        .getUsuario(this.authService.currentUserSig()?.email)
        .then((r) => {
          this.usuarioActual = r;
        });
    }, 2500);
  }

  // nombre: string;
  // apellido: string;
  // edad: string;
  // dni: string;
  // obraSocial: string;
  // especialidad: string;
  // mail: string;
  // imagenUno: string;
  // rol: string;
}
