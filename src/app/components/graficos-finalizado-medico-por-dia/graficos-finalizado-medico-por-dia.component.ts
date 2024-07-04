import { Component, inject } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TurnosService } from '../../services/turnos.service';
import { turnoInterface } from '../../interface/turno.interface';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';

interface TurnosAgrupadosEspecialista {
  name: string | undefined;
  value: number;
}

@Component({
  selector: 'app-graficos-finalizado-medico-por-dia',
  standalone: true,
  imports: [NgxChartsModule, FormsModule],
  templateUrl: './graficos-finalizado-medico-por-dia.component.html',
  styleUrl: './graficos-finalizado-medico-por-dia.component.css',
})
export class GraficosFinalizadoMedicoPorDiaComponent {
  turnosService = inject(TurnosService);

  single: any[] = [];
  view: [number, number] = [500, 400];
  showLegend: boolean = true;
  showLabels: boolean = true;
  colorScheme: string = 'horizon';

  startDate: string = '10/10/2020';
  endDate: string = '10/10/2025';

  turnosAux: any[] = [];

  ngOnInit(): void {
    this.turnosService.getTurnos().subscribe((data) => {
      this.turnosAux = data;
      this.single = this.agruparTurnosRealizadosPorEspecialista(
        data,
        this.startDate,
        this.endDate
      );
    });
  }

  parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  clickBuscar() {
    this.single = this.agruparTurnosRealizadosPorEspecialista(
      this.turnosAux,
      this.startDate,
      this.endDate
    );
  }

  agruparTurnosRealizadosPorEspecialista = (
    turnos: turnoInterface[],
    startDate: string,
    endDate: string
  ): TurnosAgrupadosEspecialista[] => {
    const start = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    const turnosRealizadosEnLapso = turnos.filter((turno) => {
      const turnoDate = this.parseDate(turno.date);
      return (
        turnoDate >= start && turnoDate <= end && turno.estado === 'realizado'
      );
    });

    const agrupados = turnosRealizadosEnLapso.reduce((acc, turno) => {
      if (turno.especialista != undefined) {
        if (!acc[turno.especialista]) {
          acc[turno.especialista] = 0;
        }
        acc[turno.especialista]++;
      }
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(agrupados).map((especialista) => ({
      name: especialista,
      value: agrupados[especialista],
    }));
  };

  onSelect(event: any) {
    console.log(event);
  }

  descargarPDF(turnos: TurnosAgrupadosEspecialista[]) {
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
