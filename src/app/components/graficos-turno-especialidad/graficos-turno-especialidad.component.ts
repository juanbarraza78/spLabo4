import { Component, inject } from '@angular/core';
import { Color, NgxChartsModule } from '@swimlane/ngx-charts';
import {
  turnoInterface,
  turnoInterfaceID,
} from '../../interface/turno.interface';
import { TurnosService } from '../../services/turnos.service';

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
  view: [number, number] = [700, 400];
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
}
