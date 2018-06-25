import {Directive, ElementRef, OnInit, Renderer2, HostListener, HostBinding, Input} from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit {
  @Input() dc = 'transparent';
  @Input() mc = 'blue';
  @HostBinding('style.backgroundColor') nc = this.dc;
  constructor(private elRef: ElementRef, private rendere: Renderer2) { }

  ngOnInit() {
    // this.rendere.setStyle(this.elRef.nativeElement, 'background-color' , 'blue');
  }

  @HostListener('mouseenter') mouseover(eventData: Event) {
    // this.rendere.setStyle(this.elRef.nativeElement, 'background-color' , 'blue');
    this.nc = this.mc;
  }

  @HostListener('mouseleave') mouseleave(eventData: Event) {
    // this.rendere.setStyle(this.elRef.nativeElement, 'background-color' , 'transparent');
    this.nc = this.dc;
  }
}
