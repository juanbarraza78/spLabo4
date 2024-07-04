import { Component, inject } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { LogsService } from '../../services/logs.service';
import { turnoInterface } from '../../interface/turno.interface';
import { GraficosComponent } from '../graficos/graficos.component';
import { GraficosTurnoEspecialidadComponent } from '../graficos-turno-especialidad/graficos-turno-especialidad.component';
import { GraficosTurnoPorDiaComponent } from '../graficos-turno-por-dia/graficos-turno-por-dia.component';
import { GraficosMedicoPorDiaComponent } from '../graficos-medico-por-dia/graficos-medico-por-dia.component';
import { GraficosFinalizadoMedicoPorDiaComponent } from '../graficos-finalizado-medico-por-dia/graficos-finalizado-medico-por-dia.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    GraficosComponent,
    GraficosTurnoEspecialidadComponent,
    GraficosTurnoPorDiaComponent,
    GraficosMedicoPorDiaComponent,
    GraficosFinalizadoMedicoPorDiaComponent,
    CommonModule,
  ],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css',
})
export class EstadisticasComponent {
  starDate1: string = '';
  endDate1: string = '';
  authService = inject(FirebaseAuthService);
  logService = inject(LogsService);

  turnos: turnoInterface[] = [
    {
      date: '29/06/2024',
      time: '10:00 AM',
      paciente: 'Juan Pérez',
      especialista: 'Dra. Gómez',
      especialidad: 'Cardiología',
      estado: 'Confirmado',
      encuestaPaciente: '',
      comentarioPaciente: '',
      comentarioEspecialista: '',
    },
    {
      date: '29/06/2024',
      time: '11:00 AM',
      paciente: 'María López',
      especialista: 'Dr. García',
      especialidad: 'Dermatología',
      estado: 'Pendiente',
      encuestaPaciente: '',
      comentarioPaciente: '',
      comentarioEspecialista: '',
    },
    {
      date: '30/06/2024',
      time: '12:00 PM',
      paciente: 'Carlos Martínez',
      especialista: 'Dra. Gómez',
      especialidad: 'Cardiología',
      estado: 'Confirmado',
      encuestaPaciente: '',
      comentarioPaciente: '',
      comentarioEspecialista: '',
    },
    {
      date: '2024-06-29',
      time: '13:00 PM',
      paciente: 'Carlos Martínez',
      especialista: 'Dra. Gómez',
      especialidad: 'Cardiología',
      estado: 'Realizado',
      encuestaPaciente: '',
      comentarioPaciente: '',
      comentarioEspecialista: '',
    },
    {
      date: '2024-06-29',
      time: '14:00 PM',
      paciente: 'Carlos Martínez',
      especialista: 'Dra. Gómez',
      especialidad: 'Cardiología',
      estado: 'Realizado',
      encuestaPaciente: '',
      comentarioPaciente: '',
      comentarioEspecialista: '',
    },
  ];
}
