import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import * as fromApp from '../store/app.reducers';
import * as fromAuth from './store/auth.reducers';
import {Store} from '@ngrx/store';
import {Injectable} from '@angular/core';
import {take, map} from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private store: Store<fromApp.AppState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('auth')
      /** take one action from this type */
      .pipe(take(1),
        map((authState: fromAuth.State) => {
          return authState.authenticated
      }));
  }
}
