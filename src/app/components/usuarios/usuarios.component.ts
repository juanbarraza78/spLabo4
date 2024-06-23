import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { EspecialistaInterfaceId } from '../../interface/especialista.interface';
import { PacienteInterfaceId } from '../../interface/paciente.interface';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent {
  authService = inject(FirebaseAuthService);
  usuarios: any[] = [];
  usuariosEspecialistas: EspecialistaInterfaceId[] = [];
  usuariosPacientes: PacienteInterfaceId[] = [];

  ngOnInit() {
    this.authService.getUsuarios().subscribe((data) => {
      this.usuarios = data;
      this.usuariosEspecialistas = data.filter(
        (usuario) => usuario.rol === 'especialista'
      );
      this.usuariosPacientes = data.filter(
        (usuario) => usuario.rol === 'paciente'
      );
    });
  }

  validarEspecialista(especialista: any) {
    let estaValidadoAux: boolean;
    if (especialista.estaValidado) {
      estaValidadoAux = false;
    } else {
      estaValidadoAux = true;
    }
    const auxEspecialista = {
      nombre: especialista.nombre,
      apellido: especialista.apellido,
      edad: especialista.edad,
      dni: especialista.dni,
      especialidad: especialista.especialidad,
      mail: especialista.mail,
      imagenUno: especialista.imagenUno,
      rol: especialista.rol,
      estaValidado: estaValidadoAux,
      deSemana: especialista.deSemana,
      hastaSemana: especialista.hastaSemana,
      deSabado: especialista.deSabado,
      hastaSabado: especialista.hastaSabado,
    };
    this.authService.updateUsuarioEspecialista(
      especialista.id,
      auxEspecialista
    );
  }
}
