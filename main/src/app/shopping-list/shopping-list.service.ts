import {Ingrediant} from "../sheard/ingrediant.model";
import {EventEmitter} from "@angular/core";

export class ShoppingListService {
  ingrediantChange = new EventEmitter<Ingrediant[]>();
  private ingredients: Ingrediant[] = [
    new Ingrediant('salt', 5),
    new Ingrediant('tomato', 5)
  ];

  getShoppingList() {
    return this.ingredients.slice();
  }

  newElement(ing: Ingrediant) {
    console.log(ing);
    this.ingredients.push(ing);
    this.ingrediantChange.emit(this.ingredients.slice());
  }
}
