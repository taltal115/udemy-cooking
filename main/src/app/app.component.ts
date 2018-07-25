import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedFeature = 'recipe';

  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyAb-SE6fRgdoroTH4tuNwB6SigUA8pYFvo",
      authDomain: "ng-recipe-book-f859e.firebaseio.com"
    })
  }

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
