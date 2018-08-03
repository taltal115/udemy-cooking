import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Ingredient } from '../shared/ingredient.model';
import {Observable} from 'rxjs/Observable';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as ShoppingListReducers from './store/shopping-list.reducers';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ingredients: Ingredient[]}>;

  constructor(private store: Store<ShoppingListReducers.AppState>) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList')
  }

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
  }
}
