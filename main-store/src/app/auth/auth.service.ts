import { Router } from '@angular/router';
import * as firebase from 'firebase';
import {Injectable, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers'
import * as AuthActions from './store/auth.actions'
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthService implements OnInit{
  authState: Observable<any>;

  constructor(
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.authState = this.store.select('auth');
  }

  signupUser(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(
        user => {
          this.store.dispatch(new AuthActions.Signup());
          this.router.navigate(['/signin'])
          firebase.auth().currentUser.getToken()
            .then(
              (token: string) => {
                this.store.dispatch(new AuthActions.SetToken(token));
              }
            )
        }
      )
      .catch(
        error => console.log(error)
      )
  }

  signinUser(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(
        response => {
          this.store.dispatch(new AuthActions.Signin());
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.router.navigate(['/']);
          firebase.auth().currentUser.getToken()
            .then(
              (token: string) => {
                this.store.dispatch(new AuthActions.SetToken(token));
              }
            )
        }
      )
      .catch(
        error => console.log(error)
      );
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    localStorage.removeItem('currentUser');
    firebase.auth().signOut();
    this.router.navigate(['/signin']);
  }
}
