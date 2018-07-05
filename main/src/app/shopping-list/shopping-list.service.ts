import {Ingredient} from "../sheard/ingredient.model";
import {EventEmitter, Injectable} from "@angular/core";

@Injectable()
export class ShoppingListService {
  ingredientChange = new EventEmitter<Ingredient[]>();
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
    this.ingredientChange.emit(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients);
    this.ingredientChange.emit(this.ingredients.slice())
  }
}
