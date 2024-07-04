import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { EspecialistaInterfaceId } from '../../interface/especialista.interface';
import { PacienteInterfaceId } from '../../interface/paciente.interface';
import { RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { turnoInterfaceID } from '../../interface/turno.interface';
import { TurnosService } from '../../services/turnos.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    RouterLink,
    MatSlideToggleModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent {
  authService = inject(FirebaseAuthService);
  turnosService = inject(TurnosService);
  usuarios: any[] = [];
  usuariosEspecialistas: EspecialistaInterfaceId[] = [];
  usuariosPacientes: PacienteInterfaceId[] = [];
  listaTurnos: turnoInterfaceID[] = [];

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
    this.turnosService.getTurnos().subscribe((data) => {
      this.listaTurnos = data;
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
      usuariosAtentidos: especialista.usuariosAtentidos,
    };
    this.authService.updateUsuarioEspecialista(
      especialista.id,
      auxEspecialista
    );
  }

  clickUsuario(email: string) {
    const listaFiltrado: turnoInterfaceID[] = this.listaTurnos.filter(
      (turno) => turno.paciente == email
    );
    const arrayFinal = listaFiltrado.map((usuario) => {
      return {
        Paciente: usuario.paciente,
        Horario: usuario.time,
        Fecha: usuario.date,
        Especialista: usuario.especialista,
        Especialidad: usuario.especialidad,
      };
    });
    this.exportToExcel(arrayFinal);
  }

  exportToExcel(data: any[]): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'exported_data.xlsx');
  }
}
