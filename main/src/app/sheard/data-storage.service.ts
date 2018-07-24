import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {RecipeService} from '../recipes/recipe.service';

@Injectable()
export class DataStorageService {
  constructor(private http: Http, private recipeService: RecipeService){}

  storeRecipe() {
    return this.http.put(
      'https://ng-recipe-book-f859e.firebaseio.com/recipes.json',
      this.recipeService.getRecipes()
    )
  }
}
