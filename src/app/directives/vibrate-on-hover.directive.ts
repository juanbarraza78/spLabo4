import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appVibrateOnHover]',
  standalone: true,
})
export class VibrateOnHoverDirective {
  private intervalId: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.startVibration();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.stopVibration();
  }

  private startVibration() {
    let position = 1;
    this.intervalId = setInterval(() => {
      position = position === 1 ? -1 : 1;
      this.renderer.setStyle(
        this.el.nativeElement,
        'transform',
        `translateX(${position}px)`
      );
    }, 50);
  }

  private stopVibration() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(0)');
  }
}
