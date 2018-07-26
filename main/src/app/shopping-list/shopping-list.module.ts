import {NgModule} from '@angular/core';

import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ShoppingListRoutingModule} from './shopping-list-routing.module';
import {SharedModules} from '../shared/shared.modules';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    CommonModule, //Must be here
    FormsModule,
    SharedModules,
    ShoppingListRoutingModule
  ],
})
export class ShoppingListModule {}
