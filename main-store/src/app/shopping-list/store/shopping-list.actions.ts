import { Action } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';

export const  ADD_INGREDIENT = 'ADD_INGREDIENT',
              ADD_INGREDIENTS = 'ADD_INGREDIENTS',
              UPDATE_INGREDIENT = 'UPDATE_INGREDIENT',
              DELETE_INGREDIENT = 'DELETE_INGREDIENT',
              STOP_EDIT = 'STOP_EDIT',
              START_EDIT = 'START_EDIT';

export class AddIngredient implements Action {
  readonly type = ADD_INGREDIENT;
  constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
  readonly type = ADD_INGREDIENTS;
  constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action {
  readonly type = UPDATE_INGREDIENT;
  constructor(public payload: {ingredient: Ingredient}) {}
}

export class DeleteIngredient implements Action {
  readonly type = DELETE_INGREDIENT;
}

export class StartEdit implements Action {
  readonly type = START_EDIT;
  constructor(public payload: number) {}
}

export class StopEdit implements Action {
  readonly type = STOP_EDIT;
}

export type ShoppingListActions =
    AddIngredient |
    AddIngredients |
    UpdateIngredient |
    DeleteIngredient |
    StartEdit |
    StopEdit;
