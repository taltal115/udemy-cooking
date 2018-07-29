import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedFeature = 'recipe';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyAb-SE6fRgdoroTH4tuNwB6SigUA8pYFvo",
      authDomain: "ng-recipe-book-f859e.firebaseio.com"
    });
    const currentUser = localStorage.getItem('currentUser');
    if(currentUser) {
      const accessToken = JSON.parse(currentUser).stsTokenManager.accessToken;
      this.authService.setToken(accessToken);
      console.log(accessToken);
    }
  }

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
