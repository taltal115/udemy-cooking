import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import {Store} from '@ngrx/store';
import * as fromApp from './store/app.reducers'
import * as AuthActions from './auth/store/auth.actions'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedFeature = 'recipe';

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyAb-SE6fRgdoroTH4tuNwB6SigUA8pYFvo",
      authDomain: "ng-recipe-book-f859e.firebaseio.com"
    });
    const currentUser = localStorage.getItem('currentUser');
    if(currentUser) {
      const accessToken = JSON.parse(currentUser).stsTokenManager.accessToken;
      this.store.dispatch(new AuthActions.SetToken(accessToken));
      console.log(accessToken);
    }
  }

  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
