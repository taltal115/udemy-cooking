import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() navChange = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }
  onSelect(selection: string) {
    console.log(selection);
    this.navChange.emit(selection);
  }
}
