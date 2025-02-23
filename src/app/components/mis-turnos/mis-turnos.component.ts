import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { TurnosService } from '../../services/turnos.service';
import {
  turnoInterface,
  turnoInterfaceID,
} from '../../interface/turno.interface';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HistorialClinicaService } from '../../services/historial-clinica.service';
import { especialidadInterface } from '../../interface/especialidad.interface';
import { EspecialistaInterface } from '../../interface/especialista.interface';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css',
})
export class MisTurnosComponent {
  authService = inject(FirebaseAuthService);
  turnosService = inject(TurnosService);
  historialService = inject(HistorialClinicaService);
  toastAlert = inject(ToastrService);
  router = inject(Router);

  listaTurnosPacientes: turnoInterfaceID[] = [];
  listaTurnosPacientesFiltrado: turnoInterfaceID[] = [];

  buscarString: string = '';

  ngOnInit(): void {
    setTimeout(() => {
      if (this.authService.currentUserSig()?.rol == 'paciente') {
        this.turnosService.getTurnos().subscribe((data) => {
          this.listaTurnosPacientes = data.filter((r) => {
            return r.paciente == this.authService.currentUserSig()?.email;
          });
          this.listaTurnosPacientesFiltrado = this.listaTurnosPacientes;
          this.buscarString = '';
        });
      } else if (this.authService.currentUserSig()?.rol == 'especialista') {
        this.turnosService.getTurnos().subscribe((data) => {
          this.listaTurnosPacientes = data.filter((r) => {
            return r.especialista == this.authService.currentUserSig()?.email;
          });
          this.listaTurnosPacientesFiltrado = this.listaTurnosPacientes;
          this.buscarString = '';
        });
      }
    }, 2500);
  }

  async buscar() {
    this.listaTurnosPacientesFiltrado = [];
    const term = this.buscarString.toLowerCase();
    if (
      this.authService.currentUserSig()?.rol == 'paciente' ||
      this.authService.currentUserSig()?.rol == 'especialista'
    ) {
      // Poner filtro del historial
      this.listaTurnosPacientes.forEach(async (turno) => {
        let esValido: boolean = false;
        const historialTurno =
          await this.historialService.getHistoriaClinicaIdTurno(turno.id);
        if (historialTurno) {
          if (
            historialTurno.altura == term ||
            historialTurno.peso == term ||
            historialTurno.temperatura == term ||
            historialTurno.precion == term ||
            historialTurno.arrayObservaciones[1]?.toLowerCase() == term ||
            historialTurno.arrayObservaciones[3]?.toLowerCase() == term ||
            historialTurno.arrayObservaciones[5]?.toLowerCase() == term
          ) {
            esValido = true;
          }
        }
        if (
          turno.especialidad?.toLowerCase().includes(term) ||
          turno.especialista?.toLowerCase().includes(term) ||
          turno.date?.toLowerCase().includes(term) ||
          turno.estado?.toLowerCase().includes(term) ||
          turno.time?.toLowerCase().includes(term) ||
          turno.paciente?.toLowerCase().includes(term)
        ) {
          esValido = true;
        }
        if (esValido) {
          this.listaTurnosPacientesFiltrado.push(turno);
        }
      });
    }
  }

  // Botones
  pacienteCancelarTurno(turno: turnoInterfaceID) {
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
        this.modificarEstadoComentarioPaciente(
          'cancelado',
          result.value,
          turno
        );
      }
    });
  }
  pacienteVerResena(turno: turnoInterfaceID) {
    Swal.fire({
      title: 'Reseña Especialista',
      text: turno.comentarioEspecialista,
    });
  }
  pacienteCompletarEncuesta(turno: turnoInterfaceID) {
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
        this.modificarEncuestaPaciente(result.value, turno);
      }
    });
  }
  pacienteCalificarAtencion(turno: turnoInterfaceID) {
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
        this.modificarComentarioPaciente(result.value, turno);
      }
    });
  }
  especialistaCancelarTurno(turno: turnoInterfaceID) {
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
  especialistaRechazarTruno(turno: turnoInterfaceID) {
    Swal.fire({
      title: 'Mensaje de Rechazo',
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
          'rechazado',
          result.value,
          turno
        );
      }
    });
  }
  especialistaAceptarTurno(turno: turnoInterfaceID) {
    Swal.fire({
      title: 'Esta Seguro de Aceptar',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.modificarEstadoEspecialista('aceptado', turno);
      }
    });
  }
  especialistaFinalizarTurno(turno: turnoInterfaceID) {
    if (
      turno.paciente != undefined &&
      turno.especialista != undefined &&
      turno.id != undefined &&
      turno.especialidad != undefined
    ) {
      this.historialService.mailPaciente = turno.paciente;
      this.historialService.mailEspecialista = turno.especialista;
      this.historialService.idTurno = turno.id;
      this.historialService.especialidadEspecialista = turno.especialidad;
    }
    Swal.fire({
      title: 'Mensaje de Finalizacion',
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
        this.authService.getUsuarioId(turno.especialista).then((r) => {
          const arrayAux: string[] = r.usuariosAtentidos;
          const existe = arrayAux.some((user) => user == turno.paciente);
          if (!existe && turno.paciente) {
            arrayAux.push(turno.paciente);
          }
          const especialistaAix: EspecialistaInterface = {
            nombre: r.nombre,
            apellido: r.apellido,
            edad: r.edad,
            dni: r.dni,
            especialidad: r.especialidad,
            mail: r.mail,
            imagenUno: r.imagenUno,
            rol: r.rol,
            estaValidado: r.estaValidado,
            deSemana: r.deSemana,
            hastaSemana: r.hastaSemana,
            deSabado: r.deSabado,
            hastaSabado: r.hastaSabado,
            usuariosAtentidos: arrayAux,
          };
          this.authService.updateUsuarioEspecialista(r.id, especialistaAix);
        });
        this.modificarEstadoComentarioEspecialista(
          'realizado',
          result.value,
          turno
        );
        this.router.navigateByUrl('/cargarHistorialClinica');
      }
    });
  }
  // Aux
  modificarEstadoComentarioPaciente(
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
      comentarioPaciente: comentarioTurno,
      comentarioEspecialista: turno.comentarioEspecialista,
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
  modificarEncuestaPaciente(encuesta: string, turno: turnoInterfaceID) {
    const turnoAux: turnoInterface = {
      date: turno.date,
      time: turno.time,
      paciente: turno.paciente,
      especialista: turno.especialista,
      especialidad: turno.especialidad,
      estado: turno.estado,
      encuestaPaciente: encuesta,
      comentarioPaciente: turno.comentarioPaciente,
      comentarioEspecialista: turno.comentarioEspecialista,
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
  modificarComentarioPaciente(comentario: string, turno: turnoInterfaceID) {
    const turnoAux: turnoInterface = {
      date: turno.date,
      time: turno.time,
      paciente: turno.paciente,
      especialista: turno.especialista,
      especialidad: turno.especialidad,
      estado: turno.estado,
      encuestaPaciente: turno.encuestaPaciente,
      comentarioPaciente: comentario,
      comentarioEspecialista: turno.comentarioEspecialista,
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
  modificarEstadoEspecialista(estadoTurno: string, turno: turnoInterfaceID) {
    const turnoAux: turnoInterface = {
      date: turno.date,
      time: turno.time,
      paciente: turno.paciente,
      especialista: turno.especialista,
      especialidad: turno.especialidad,
      estado: estadoTurno,
      encuestaPaciente: turno.encuestaPaciente,
      comentarioPaciente: turno.comentarioPaciente,
      comentarioEspecialista: turno.comentarioEspecialista,
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
