import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  selection = 'recipe';
  oddNumbers: number[] = [];
  evenNumbers: number[] = [];

  onIntFire(fireNumber: number) {
    if (fireNumber % 2 === 0) {
      this.evenNumbers.push(fireNumber);
    } else {
      this.oddNumbers.push(fireNumber);
    }
  }
  onNavChange(selection: string) {
    this.selection = selection;
  }
}
