import { Component, OnInit, Input } from '@angular/core';
import {Ingrediant} from '../sheard/ingrediant.model';
import {ShoppingListService} from "./shopping-list.service";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  // @Input() selected: string;
  ingredients: Ingrediant[];

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.ingredients = this.slService.getShoppingList();
    this.slService.ingrediantChange.
      subscribe(
      (ing: Ingrediant[]) => this.ingredients = ing
    )
  }
}
