import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { TurnosService } from '../../services/turnos.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import {
  turnoInterface,
  turnoInterfaceID,
} from '../../interface/turno.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.css',
})
export class TurnosComponent {
  authService = inject(FirebaseAuthService);
  turnosService = inject(TurnosService);
  toastAlert = inject(ToastrService);

  listaTurnosPacientes: turnoInterfaceID[] = [];
  listaTurnosPacientesFiltrado: turnoInterfaceID[] = [];
  buscarString: string = '';

  ngOnInit(): void {
    setTimeout(() => {
      if (this.authService.currentUserSig()?.rol == 'admin') {
        this.turnosService.getTurnos().subscribe((data) => {
          this.listaTurnosPacientes = data;
          this.listaTurnosPacientesFiltrado = this.listaTurnosPacientes;
          this.buscarString = '';
        });
      }
    }, 2500);
  }
  buscar() {
    const term = this.buscarString.toLowerCase();
    this.listaTurnosPacientesFiltrado = this.listaTurnosPacientes.filter(
      (turno) =>
        turno.especialidad?.toLowerCase().includes(term) ||
        turno.especialista?.toLowerCase().includes(term)
    );
  }

  // Botones
  adminCancelarTurno(turno: turnoInterfaceID) {
    Swal.fire({
      title: 'Mensaje de cancelacion',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: async (r) => {
        return r;
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        // Modificar
        console.log(result);
        this.modificarEstadoComentarioEspecialista(
          'cancelado',
          result.value,
          turno
        );
      }
    });
  }
  // Aux
  modificarEstadoComentarioEspecialista(
    estadoTurno: string,
    comentarioTurno: string,
    turno: turnoInterfaceID
  ) {
    const turnoAux: turnoInterface = {
      date: turno.date,
      time: turno.time,
      paciente: turno.paciente,
      especialista: turno.especialista,
      especialidad: turno.especialidad,
      estado: estadoTurno,
      encuestaPaciente: turno.encuestaPaciente,
      comentarioPaciente: turno.comentarioPaciente,
      comentarioEspecialista: comentarioTurno,
    };
    this.turnosService
      .updateTurno(turno.id, turnoAux)
      .then(() => {
        this.toastAlert.success('Se modifico Correctamente', 'Exito');
      })
      .catch(() => {
        this.toastAlert.error('No se pudo Modificar', 'Error');
      });
  }
}
