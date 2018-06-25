import {Directive, HostBinding, HostListener, OnInit} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class AppDropdownDirective implements OnInit {
  @HostBinding('class.open') isOpen = false;
  constructor() {}

  ngOnInit() {}
  @HostListener('click') myclick(data: Event) {
    this.isOpen = !this.isOpen;
  }
}
