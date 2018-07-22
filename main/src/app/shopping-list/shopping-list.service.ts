import {Ingredient} from "../sheard/ingredient.model";
import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";

@Injectable()
export class ShoppingListService {
  ingredientChange = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('salt', 5),
    new Ingredient('tomato', 5)
  ];

  getShoppingList() {
    return this.ingredients.slice();
  }

  getIngredient(index: number){
    return this.ingredients[index]
  }

  newIngredient(ing: Ingredient) {
    console.log(ing);
    this.ingredients.push(ing);
    this.ingredientChange.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients);
    this.ingredientChange.next(this.ingredients.slice())
  }

  updateIngredient(index: number, newIngredient: Ingredient){
    this.ingredients[index] = newIngredient;
    this.ingredientChange.next(this.ingredients.slice())
  }

  deleteIngredient(index: number){
    this.ingredients.splice(index, 1);
    this.ingredientChange.next(this.ingredients.slice())
  }
}
