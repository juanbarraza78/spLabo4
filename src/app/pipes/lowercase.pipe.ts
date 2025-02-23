import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lowercase',
  standalone: true,
})
export class LowercasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    return value.toLowerCase();
  }
}
