import { Component, inject } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TurnosService } from '../../services/turnos.service';
import { turnoInterface } from '../../interface/turno.interface';

interface TurnosAgrupadosEspecialista {
  name: string | undefined;
  value: number;
}

@Component({
  selector: 'app-graficos-finalizado-medico-por-dia',
  standalone: true,
  imports: [NgxChartsModule],
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

  startDate = '10/10/2020';
  endDate = '10/10/2025';

  ngOnInit(): void {
    this.turnosService.getTurnos().subscribe((data) => {
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
}
