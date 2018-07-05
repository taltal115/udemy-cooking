import { Component, OnInit, Input } from '@angular/core';
import {Ingredient} from '../sheard/ingredient.model';
import {ShoppingListService} from "./shopping-list.service";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  // @Input() selected: string;
  ingredients: Ingredient[];

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.slService.getShoppingList();
    this.slService.ingredientChange.subscribe(
      (ing: Ingredient[]) => this.ingredients = ing
    );
  }
}
