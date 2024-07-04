import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEnlargeOnClick]',
  standalone: true,
})
export class EnlargeOnClickDirective {
  private originalSize: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.originalSize = this.el.nativeElement.style.transform;
  }

  @HostListener('click') onMouseClick() {
    const scale =
      this.el.nativeElement.style.transform === 'scale(1.1)'
        ? 'scale(1)'
        : 'scale(1.1)';
    this.renderer.setStyle(this.el.nativeElement, 'transform', scale);
  }
}
