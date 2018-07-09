import { NgModule } from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ShoppingListComponent} from "./shopping-list/shopping-list.component";
import {RecipesComponent} from "./recipes/recipes.component";
import {RecipeItemComponent} from "./recipes/recipe-list/recipe-item/recipe-item.component";
import {RecipeStartComponent} from "./recipes/recipe-start/recipe-start.component";
import {RecipeDetailComponent} from "./recipes/recipe-detail/recipe-detail.component";

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: "full"},
  { path: 'recipes', component: RecipesComponent
    , children: [
      { path: '', component: RecipeStartComponent},
      { path: ':id', component: RecipeDetailComponent},
    ]
  },
  { path: 'shopping-list',
    // canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    component: ShoppingListComponent,
    // children: [
    //   { path: ':id', component: ServerComponent, resolve: {server: ServerResolver}},
    //   { path: ':id/edit', component: EditServerComponent, canDeactivate: [CanDeactivatedGuard]}
    // ]
  },
  // { path: "not-found", component: PageNotFoundComponent},
  // { path: "not-found", component: ErrorPageComponent, data: {message: 'Page not found!'}},
  // { path: "**", redirectTo: '/not-found'}
];

@NgModule ({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
