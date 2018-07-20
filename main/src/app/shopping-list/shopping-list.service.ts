import {Ingredient} from "../sheard/ingredient.model";
import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";

@Injectable()
export class ShoppingListService {
  ingredientChange = new Subject<Ingredient[]>();
  private ingredients: Ingredient[] = [
    new Ingredient('salt', 5),
    new Ingredient('tomato', 5)
  ];

  getShoppingList() {
    return this.ingredients.slice();
  }

  newElement(ing: Ingredient) {
    console.log(ing);
    this.ingredients.push(ing);
    this.ingredientChange.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients);
    this.ingredientChange.next(this.ingredients.slice())
  }
}
