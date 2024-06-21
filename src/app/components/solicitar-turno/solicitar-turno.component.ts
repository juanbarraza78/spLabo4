import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { especialidadInterfaceID } from '../../interface/especialidad.interface';
import { EspecialidadService } from '../../services/especialidad.service';
import { EspecialistaInterfaceId } from '../../interface/especialista.interface';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { PacienteInterfaceId } from '../../interface/paciente.interface';
import {
  turnoInterface,
  turnoInterfaceID,
} from '../../interface/turno.interface';
import { TurnosService } from '../../services/turnos.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css',
})
export class SolicitarTurnoComponent {
  fb = inject(FormBuilder);
  especialidadService = inject(EspecialidadService);
  authService = inject(FirebaseAuthService);
  turnosService = inject(TurnosService);
  toastAlert = inject(ToastrService);

  futureDays: {
    date: string;
    day: string;
    buttons: { time: string; selected: boolean }[];
  }[] = [];
  selectedDate: string | null = null;
  selectedDay: {
    date: string;
    day: string;
    buttons: { time: string; selected: boolean }[];
  } | null = null;

  arrayEspecialidades?: especialidadInterfaceID[];
  usuariosEspecialistas: EspecialistaInterfaceId[] = [];
  usuariosEspecialistasFiltrado: EspecialistaInterfaceId[] = [];
  usuariosPacientes: PacienteInterfaceId[] = [];
  turnos: turnoInterfaceID[] = [];
  turnosFiltrados: turnoInterfaceID[] = [];

  especialistaElegido?: string;
  especialidadElegida?: string;
  turnosElegidos: any[] = [];
  pacienteElegido?: string;

  filtrarTurnosPorEspecialista(mailEspecialista: string | undefined) {
    if (mailEspecialista) {
      this.turnosFiltrados = this.turnos.filter(
        (turno) => turno.especialista == mailEspecialista
      );
    } else {
      console.log('no existe especialista');
    }
  }

  rolUsuarioActual: string = '';

  ngOnInit() {
    this.especialidadService.getEspecialidad().subscribe((data) => {
      this.arrayEspecialidades = data;
    });
    this.authService.getUsuarios().subscribe((data) => {
      this.usuariosEspecialistas = data.filter(
        (usuario) => usuario.rol === 'especialista'
      );
      this.usuariosPacientes = data.filter(
        (usuario) => usuario.rol === 'paciente'
      );
    });
    this.turnosService.getTurnos().subscribe((data) => {
      this.turnos = data;
    });
    setTimeout(() => {
      this.rolUsuario().then((r) => (this.rolUsuarioActual = r));
    }, 1000);
  }

  // Form
  form = this.fb.nonNullable.group({
    especialidad: ['', Validators.required],
  });
  changeEspecialidad(event: Event) {
    const selectedDate = (event.target as HTMLSelectElement).value;
    if (selectedDate == 'Todos') {
      this.usuariosEspecialistasFiltrado = this.usuariosEspecialistas;
    } else {
      this.usuariosEspecialistasFiltrado = this.usuariosEspecialistas.filter(
        (usuario) =>
          usuario.especialidad === this.form.getRawValue().especialidad
      );
    }
  }

  async rolUsuario() {
    let respuesta = null;
    if (this.authService.currentUserSig()?.email) {
      respuesta = await this.authService.getUsuario(
        this.authService.currentUserSig()?.email
      );
      respuesta = respuesta.rol;
    }
    return respuesta;
  }

  clickEspecialista(usuario: any) {
    this.especialistaElegido = usuario.mail;
    this.especialidadElegida = usuario.especialidad;
    this.filtrarTurnosPorEspecialista(this.especialistaElegido);
    this.calculateFutureDays();
    console.log(usuario);
  }
  clickPaciente(usuario: any) {
    this.pacienteElegido = usuario.mail;
  }
  // Botones
  calculateFutureDays(): void {
    this.futureDays = [];
    const daysOfWeek = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    const today = new Date();

    for (let i = 0; i < 15; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const dayOfWeek = daysOfWeek[futureDate.getDay()];

      const buttons = this.generateButtons(futureDate);

      this.futureDays.push({
        date: this.formatDate(futureDate),
        day: dayOfWeek,
        buttons: buttons,
      });
    }
  }
  generateButtons(date: Date): { time: string; selected: boolean }[] {
    const buttons: { time: string; selected: boolean }[] = [];
    let startHour, endHour;
    const dayOfWeek = date.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Lunes a Viernes
      startHour = 8;
      endHour = 19;
    } else if (dayOfWeek === 6) {
      // Sábado
      startHour = 8;
      endHour = 14;
    } else {
      // Domingo
      return buttons;
    }

    for (let hour = startHour; hour <= endHour; hour++) {
      this.addButton(buttons, date, hour, 0);
      if (hour !== endHour) {
        this.addButton(buttons, date, hour, 30);
      }
    }

    return buttons;
  }
  addButton(
    buttons: { time: string; selected: boolean }[],
    date: Date,
    hour: number,
    minute: number
  ): void {
    const time = this.formatTime(hour, minute);
    const formattedDate = this.formatDate(date);
    const slot = { date: formattedDate, time: time };

    if (
      !this.turnosFiltrados.some(
        (turnos) => turnos.date == slot.date && turnos.time == slot.time
      )
    ) {
      buttons.push({ time: time, selected: false });
    }
  }
  formatDate(date: Date): string {
    const day =
      date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : `${date.getMonth() + 1}`;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  formatTime(hour: number, minute: number): string {
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
    const minuteStr = minute < 10 ? `0${minute}` : `${minute}`;
    return `${hourStr}:${minuteStr}`;
  }
  onButtonClick(dateBtn: string, timeBtn: string): void {
    console.log(`Button clicked for ${dateBtn} at ${timeBtn}`);
    if (this.selectedDay) {
      this.selectedDay.buttons.forEach((button) => {
        if (button.time === timeBtn) {
          if (!button.selected) {
            this.turnosElegidos.push({ date: dateBtn, time: timeBtn });
          } else {
            const index = this.turnosElegidos.findIndex(
              (b) => b.time === timeBtn && b.date === dateBtn
            );
            if (index !== -1) {
              this.turnosElegidos.splice(index, 1);
            }
          }
          button.selected = !button.selected;
        }
      });
    }

    console.log(this.turnosElegidos);
  }
  onDayChange(event: Event): void {
    const selectedDate = (event.target as HTMLSelectElement).value;
    this.selectedDay =
      this.futureDays.find((day) => day.date === selectedDate) || null;
    this.resetButtons();
  }
  resetButtons(): void {
    if (this.selectedDay) {
      this.selectedDay.buttons.forEach((button) => {
        button.selected = false;
      });
    }
    this.turnosElegidos = [];
  }
  isAnyButtonSelected(): boolean {
    if (this.selectedDay) {
      return this.selectedDay.buttons.some((button) => button.selected);
    }
    return false;
  }

  reservar() {
    if (this.especialistaElegido && this.especialidadElegida) {
      if (this.turnosElegidos.length == 0) {
        this.toastAlert.error('No hay ningun turno', 'Error');
      } else {
        this.turnosElegidos.forEach((btn) => {
          if (this.rolUsuarioActual == 'admin') {
            if (this.pacienteElegido) {
              const turnoAux: turnoInterface = {
                date: btn.date,
                time: btn.time,
                paciente: this.pacienteElegido,
                especialista: this.especialistaElegido,
                especialidad: this.especialidadElegida,
              };
              this.turnosService
                .saveTurno(turnoAux)
                .then(() => {
                  this.toastAlert.success('Reservacion completada', 'Exito');
                })
                .catch(() => {
                  this.toastAlert.error('Error al crear un Turno', 'Error');
                });
            } else {
              this.toastAlert.error('Falta elegir paciente', 'Error');
            }
          } else if (this.rolUsuarioActual == 'paciente') {
            const turnoAux: turnoInterface = {
              date: btn.date,
              time: btn.time,
              paciente: this.authService.currentUserSig()?.email,
              especialista: this.especialistaElegido,
              especialidad: this.especialidadElegida,
            };
            this.turnosService
              .saveTurno(turnoAux)
              .then(() => {
                this.toastAlert.success('Reservacion completada', 'Exito');
              })
              .catch(() => {
                this.toastAlert.error('Error al crear un Turno', 'Error');
              });
          }
        });
      }
    } else {
      this.toastAlert.error('Faltan datos', 'Error');
    }
  }
}