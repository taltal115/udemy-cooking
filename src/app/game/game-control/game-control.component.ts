import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-game-control',
  templateUrl: './game-control.component.html',
  styleUrls: ['./game-control.component.css']
})
export class GameControlComponent implements OnInit {
  @Output() incrementEvent = new EventEmitter<number>();
  lastNumber = 0;
  interval;
  constructor() { }

  ngOnInit() {
  }
  start() {
    console.log('start');
    this.interval = setInterval(() => {
      this.incrementEvent.emit(this.lastNumber + 1);
      this.lastNumber++;
    }, 1000);
  }
  end() {
    console.log('end');
    this.lastNumber = 0;
    clearInterval(this.interval);
  }
}
