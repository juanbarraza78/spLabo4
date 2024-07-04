import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { historialInterfaceID } from '../../interface/historialClinica.interface';
import { HistorialClinicaService } from '../../services/historial-clinica.service';
import { jsPDF } from 'jspdf';
import {
  turnoInterface,
  turnoInterfaceID,
} from '../../interface/turno.interface';
import { TurnosService } from '../../services/turnos.service';
import { EspecialidadService } from '../../services/especialidad.service';
import { especialidadInterfaceID } from '../../interface/especialidad.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-ver-historial-clinica',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ver-historial-clinica.component.html',
  styleUrl: './ver-historial-clinica.component.css',
})
export class VerHistorialClinicaComponent {
  authService = inject(FirebaseAuthService);
  historialService = inject(HistorialClinicaService);
  turnosService = inject(TurnosService);
  especialidadService = inject(EspecialidadService);
  fb = inject(FormBuilder);

  arrayEspecialidades?: especialidadInterfaceID[];

  listaHistorial: historialInterfaceID[] = [];
  listaTurnos: turnoInterfaceID[] = [];

  form = this.fb.nonNullable.group({
    especialidad: ['', Validators.required],
  });

  ngOnInit(): void {
    setTimeout(() => {
      const currentUser = this.authService.currentUserSig();
      if (currentUser?.rol === 'paciente') {
        const userEmail = currentUser.email;
        if (userEmail) {
          this.historialService.getHistoriaClinica().subscribe((data) => {
            this.listaHistorial = data.filter((historial) => {
              return historial.mailPaciente === userEmail;
            });
          });
          // hacer ultimos 3 turnos
          this.turnosService.getTurnos().subscribe((data) => {
            this.listaTurnos = data;
          });
        }
      } else if (currentUser?.rol === 'especialista') {
        this.historialService.getHistoriaClinica().subscribe((data) => {
          this.listaHistorial = [];
          this.authService
            .getUsuarioId(currentUser.email)
            .then((usuarioEspecialista) => {
              if (usuarioEspecialista) {
                usuarioEspecialista.usuariosAtentidos.forEach(
                  (usuarioPaciente: string) => {
                    data.forEach((historial) => {
                      if (historial.mailPaciente == usuarioPaciente) {
                        this.listaHistorial.push(historial);
                      }
                    });
                  }
                );
              }
            });
        });
      } else if (currentUser?.rol === 'admin') {
        const userEmail = currentUser.email;
        if (userEmail) {
          this.historialService.getHistoriaClinica().subscribe((data) => {
            this.listaHistorial = data;
          });
        }
      }
    }, 2500);
    this.especialidadService.getEspecialidad().subscribe((data) => {
      this.arrayEspecialidades = data;
    });
  }

  getLastThreeTurnos(): turnoInterfaceID[] {
    return this.listaTurnos
      .map((turno) => {
        const [day, month, year] = turno.date.split('/');
        const [hours, minutes] = turno.time.split(':');
        return {
          ...turno,
          dateObj: new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hours),
            Number(minutes)
          ),
        };
      })
      .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime())
      .slice(0, 3);
  }

  onSummitEspecialidad() {
    if (this.form.valid) {
      const listaFiltrada: historialInterfaceID[] = this.listaHistorial.filter(
        (historial) =>
          historial.especialidad === this.form.getRawValue().especialidad
      );
      listaFiltrada.forEach((historial) => {
        this.descargarPDF(historial);
      });
    }
  }

  descargarPDF(historial: historialInterfaceID) {
    const doc = new jsPDF();
    doc.addImage('../../../assets/imgs/logo.png', 'PNG', 10, 10, 60, 30);
    doc.setFont('Helvetica');
    doc.setFontSize(40);
    doc.text('La Clinica', 80, 20);

    doc.setFontSize(30);
    doc.text('Historial Clinico', 80, 30);

    doc.setFontSize(25);
    doc.text(`Paciente: ${historial.mailPaciente}`, 10, 60);

    doc.setFontSize(25);
    doc.text(`Especialidad: ${historial.especialidad}`, 10, 70);

    doc.setFontSize(20);
    doc.text(`Altura: ${historial.altura}`, 10, 80);
    doc.text(`Peso: ${historial.peso}`, 10, 90);
    doc.text(`Temperatura: ${historial.temperatura}`, 10, 100);
    doc.text(`Precion: ${historial.precion}`, 10, 110);
    doc.text(
      `${historial.arrayObservaciones[0]}: ${historial.arrayObservaciones[1]}`,
      10,
      120
    );
    doc.text(
      `${historial.arrayObservaciones[2]}: ${historial.arrayObservaciones[3]}`,
      10,
      130
    );
    doc.text(
      `${historial.arrayObservaciones[4]}: ${historial.arrayObservaciones[5]}`,
      10,
      140
    );
    doc.text(`Fecha: ${this.obtenerFechaActual()}`, 10, 170);

    doc.save(`${historial.mailPaciente}_hitorial_clinica.pdf`);
  }

  obtenerFechaActual(): string {
    const fecha = new Date();

    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript son de 0 a 11
    const año = fecha.getFullYear();

    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${año} ${horas}:${minutos}`;
  }
}
