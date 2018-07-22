import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Ingredient} from '../sheard/ingredient.model';
import {ShoppingListService} from "./shopping-list.service";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  // @Input() selected: string;
  ingredients: Ingredient[];
  private subscription: Subscription;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.slService.getShoppingList();
    this.subscription = this.slService.ingredientChange.subscribe(
      (ing: Ingredient[]) => this.ingredients = ing
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onEditItem(i: number) {
    console.log(i);
    this.slService.startedEditing.next(i)
  }
}
