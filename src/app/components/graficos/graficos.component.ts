import { Component, inject } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { LogInterfaceID } from '../../interface/log.interface';
import { LogsService } from '../../services/logs.service';
import jsPDF from 'jspdf';

interface GroupedLog {
  name: string;
  series: Array<{ name: string; value: number }>;
}

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.css',
})
export class GraficosComponent {
  logService = inject(LogsService);

  logs: LogInterfaceID[] = [];
  view: [number, number] = [500, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Fecha';
  showYAxisLabel = true;
  yAxisLabel = 'Horario';
  legendTitle: string = 'Logs';

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  public multi: any[] = [];

  ngOnInit() {
    this.logService.getAll().subscribe((data) => {
      this.logs = data;
      this.setupChart();
    });
  }

  setupChart() {
    this.multi = this.groupLogsByEmail(this.logs);
  }

  convertTimeToDecimal(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  }

  groupLogsByEmail(logs: LogInterfaceID[]): GroupedLog[] {
    const groupedLogs: { [email: string]: { name: string; value: number }[] } =
      {};

    logs.forEach((log) => {
      if (!groupedLogs[log.email]) {
        groupedLogs[log.email] = [];
      }
      groupedLogs[log.email].push({
        name: log.date,
        value: this.convertTimeToDecimal(log.time),
      });
    });

    return Object.keys(groupedLogs).map((email) => ({
      name: email,
      series: groupedLogs[email],
    }));
  }

  timeToNumber(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + minutes / 60;
  }

  descargarPDF(turnos: GroupedLog[]) {
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
      doc.setFontSize(25);
      y += 10;
      doc.text(`Usuario: ${turno.name}`, 10, y);
      doc.setFontSize(20);
      turno.series.forEach((a) => {
        y += 10;
        doc.text(`Fecha: ${a.name} `, 10, y);
      });
    });

    doc.text(`Fecha: ${this.obtenerFechaActual()}`, 10, y + 30);

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
