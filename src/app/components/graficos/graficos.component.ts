import { Component, inject } from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { LogInterfaceID } from '../../interface/log.interface';
import { LogsService } from '../../services/logs.service';

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
  view: [number, number] = [700, 400];

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
}
