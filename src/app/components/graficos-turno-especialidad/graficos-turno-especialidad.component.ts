import { Component, inject } from '@angular/core';
import { Color, NgxChartsModule } from '@swimlane/ngx-charts';
import {
  turnoInterface,
  turnoInterfaceID,
} from '../../interface/turno.interface';
import { TurnosService } from '../../services/turnos.service';
import jsPDF from 'jspdf';

interface TurnosAgrupadosEspecialidad {
  name: string | undefined;
  value: number;
}

@Component({
  selector: 'app-graficos-turno-especialidad',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './graficos-turno-especialidad.component.html',
  styleUrl: './graficos-turno-especialidad.component.css',
})
export class GraficosTurnoEspecialidadComponent {
  turnosService = inject(TurnosService);

  single: any[] = [];
  view: [number, number] = [500, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Especialidad';
  showYAxisLabel = true;
  yAxisLabel = 'Turno';
  colorScheme: string = 'horizon';
  legenTitle = 'Especialidades';

  ngOnInit(): void {
    this.turnosService.getTurnos().subscribe((data) => {
      this.single = this.agruparTurnosPorEspecialidad(data);
    });
  }
  onSelect(event: any) {
    console.log(event);
  }
  agruparTurnosPorEspecialidad = (
    turnos: turnoInterface[]
  ): TurnosAgrupadosEspecialidad[] => {
    const agrupados = turnos.reduce((acc, turno) => {
      if (turno.especialidad != undefined) {
        if (!acc[turno.especialidad]) {
          acc[turno.especialidad] = 0;
        }
        acc[turno.especialidad]++;
      }
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(agrupados).map((especialidad) => ({
      name: especialidad,
      value: agrupados[especialidad],
    }));
  };

  descargarPDF(turnos: TurnosAgrupadosEspecialidad[]) {
    const doc = new jsPDF();
    doc.addImage('../../../assets/imgs/logo.png', 'PNG', 10, 10, 60, 30);
    doc.setFont('Helvetica');
    doc.setFontSize(40);
    doc.text('La Clinica', 80, 20);

    doc.setFontSize(30);
    doc.text('Historial Clinico', 80, 30);

    doc.setFontSize(25);
    let y = 60;

    turnos.forEach((turno) => {
      y += 10;
      doc.text(`Especialidad: ${turno.name} Cantidad: ${turno.value}`, 10, y);
    });

    doc.text(`Fecha: ${this.obtenerFechaActual()}`, 10, 170);

    doc.save(`Turnos_clinica.pdf`);
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
