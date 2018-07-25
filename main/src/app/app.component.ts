import {Component, OnInit} from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  selection = 'recipe';
  oddNumbers: number[] = [];
  evenNumbers: number[] = [];

  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyAb-SE6fRgdoroTH4tuNwB6SigUA8pYFvo",
      authDomain: "ng-recipe-book-f859e.firebaseapp.com",
    })
  }

  onIntFire(fireNumber: number) {
    if (fireNumber % 2 === 0) {
      this.evenNumbers.push(fireNumber);
    } else {
      this.oddNumbers.push(fireNumber);
    }
  }
}
