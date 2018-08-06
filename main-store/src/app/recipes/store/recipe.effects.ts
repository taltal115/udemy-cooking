import {Actions, Effect} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {switchMap,withLatestFrom, map } from 'rxjs/operators';
import {Recipe} from '../recipe.model';
import {HttpClient, HttpRequest} from '@angular/common/http';

import * as RecipeActions from '../store/recipe.actions';
import * as fromRecipe from '../store/recipe.reducers';
import {Store} from '@ngrx/store';

@Injectable()
export class RecipeEffects {
  @Effect()
  recipeFetch = this.actions$
    .ofType(RecipeActions.FETCH_RECIPE)
    .pipe(switchMap((action: RecipeActions.FetchRecipes) => {
      return this.httpClient.get<Recipe[]>('https://ng-recipe-book-f859e.firebaseio.com/recipes.json', {
        observe: 'body',
        responseType: 'json'
      })
    }), map(
        (recipes) => {
          for (let recipe of recipes) {
            if (!recipe['ingredients']) {
              recipe['ingredients'] = [];
            }
          }
          return {
            type: RecipeActions.SET_RECIPES,
            payload: recipes
          };
        }
      ));


  @Effect({dispatch: false})
  recipeStore = this.actions$
    .ofType(RecipeActions.STORE_RECIPE)
    .pipe(withLatestFrom(this.store.select('recipes')) ,
    switchMap(([action, state]) => {
      const req = new HttpRequest(
        'PUT',
        'https://ng-recipe-book-f859e.firebaseio.com/recipes.json',
        state.recipes,
        {reportProgress: true}
      );
      return this.httpClient.request(req);
    }));

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<fromRecipe.FeatureState>
  ) {}
}
