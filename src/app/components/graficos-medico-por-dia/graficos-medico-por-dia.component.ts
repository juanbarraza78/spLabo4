import { Component, inject } from '@angular/core';
import { turnoInterface } from '../../interface/turno.interface';
import { TurnosService } from '../../services/turnos.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

interface TurnosAgrupadosEspecialista {
  name: string | undefined;
  value: number;
}

@Component({
  selector: 'app-graficos-medico-por-dia',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './graficos-medico-por-dia.component.html',
  styleUrl: './graficos-medico-por-dia.component.css',
})
export class GraficosMedicoPorDiaComponent {
  turnosService = inject(TurnosService);

  startDate = '10/10/2020';
  endDate = '10/10/2025';

  single: any[] = [];
  view: [number, number] = [700, 400];
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  colorScheme: string = 'horizon';
  legenTitle = 'Especialidades';

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
      this.single = this.agruparTurnosPorEspecialista(
        data,
        this.startDate,
        this.endDate
      );
      console.log(this.single);
    });
  }

  parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  agruparTurnosPorEspecialista = (
    turnos: turnoInterface[],
    startDate: string,
    endDate: string
  ): TurnosAgrupadosEspecialista[] => {
    const start = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    const turnosEnLapso = turnos.filter((turno) => {
      const turnoDate = this.parseDate(turno.date);
      return turnoDate >= start && turnoDate <= end;
    });

    const agrupados = turnosEnLapso.reduce((acc, turno) => {
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
}
