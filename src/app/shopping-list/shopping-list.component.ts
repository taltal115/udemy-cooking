import { Component, OnInit, Input } from '@angular/core';
import {Ingrediant} from '../sheard/ingrediant.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingrediant[] = [
    new Ingrediant('salt', 5),
    new Ingrediant('tomato', 5)
  ];
  @Input() selected: string;

  constructor() { }

  ngOnInit() {
  }

}
