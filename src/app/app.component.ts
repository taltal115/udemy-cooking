import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  selection = 'recipe';
  onNavChange(selection: string) {
    this.selection = selection;
  }
}
