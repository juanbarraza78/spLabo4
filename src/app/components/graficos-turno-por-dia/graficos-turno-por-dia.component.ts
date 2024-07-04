import { Component, inject } from '@angular/core';
import { turnoInterface } from '../../interface/turno.interface';
import { TurnosService } from '../../services/turnos.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

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
  view: [number, number] = [700, 400];
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
}
