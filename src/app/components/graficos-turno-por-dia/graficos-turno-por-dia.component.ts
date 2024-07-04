import { Component, inject } from '@angular/core';
import { turnoInterface } from '../../interface/turno.interface';
import { TurnosService } from '../../services/turnos.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { jsPDF } from 'jspdf';

interface TurnosAgrupados {
  name: string;
  value: number;
}

@Component({
  selector: 'app-graficos-turno-por-dia',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './graficos-turno-por-dia.component.html',
  styleUrl: './graficos-turno-por-dia.component.css',
})
export class GraficosTurnoPorDiaComponent {
  turnosService = inject(TurnosService);

  single: any[] = [];
  view: [number, number] = [500, 400];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Fecha';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Cantidad';
  colorScheme: string = 'horizon';
  legendTitle: string = 'Fechas';

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  ngOnInit(): void {
    this.turnosService.getTurnos().subscribe((data) => {
      this.single = this.agruparTurnosPorFecha(data);
    });
  }
  agruparTurnosPorFecha = (turnos: turnoInterface[]): TurnosAgrupados[] => {
    const agrupados = turnos.reduce((acc, turno) => {
      if (!acc[turno.date]) {
        acc[turno.date] = 0;
      }
      acc[turno.date]++;
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(agrupados).map((date) => ({
      name: date,
      value: agrupados[date],
    }));
  };

  descargarPDF(turnos: TurnosAgrupados[]) {
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
