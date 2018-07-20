import {Recipe} from "./recipe.model";
import {Injectable} from "@angular/core";
import {Ingredient} from "../sheard/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {

  private recipes: Recipe[] = [
    new Recipe(
      'Test recipe',
      'desc',
      'https://imagesvc.timeincapp.com/v3/mm/image?url=http%3A%2F%2Fcdn-image.myrecipes.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2F4_3_horizontal_-_1200x900%2Fpublic%2F1506120378%2FMR_0917170472.jpg%3Fitok%3DKPTNrvis&w=300&h=167&c=sc&poi=face&q=85',
      [
        new Ingredient('salt',2),
        new Ingredient('paper',3)
      ]
    )
    , new Recipe(
      'Bif Welington',
      'The amazing Bif Welington',
      'https://i.ytimg.com/vi/5OAiZYjRqfo/maxresdefault.jpg',
      [
        new Ingredient('fillet',1.5),
        new Ingredient('flower',2),
        new Ingredient('mushrooms',2)
      ]
    )
  ];

  constructor(private slService: ShoppingListService){}

  getRecipes() {
    return this.recipes.slice();
  }
  getRecipe(id: number) {
    return this.recipes[id];
  }
  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.slService.addIngredients(ingredients)
  }
}
