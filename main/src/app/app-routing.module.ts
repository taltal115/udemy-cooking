import { NgModule } from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {RecipesComponent} from "./recipes/recipes.component";
import {RecipeDetailComponent} from "./recipes/recipe-detail/recipe-detail.component";
import {ShoppingListComponent} from "./shopping-list/shopping-list.component";
import {StartRecipeComponent} from "./recipes/start-recipe/start-recipe.component";
import {RecipeEditComponent} from "./recipes/recipe-edit/recipe-edit.component";
import {SignupComponent} from "./auth/signup/signup.component";

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: "full" },
  { path: 'recipes', component: RecipesComponent, children: [
      { path: '', component: StartRecipeComponent},
      { path: 'new', component: RecipeEditComponent},
      { path: ':id', component: RecipeDetailComponent},
      { path: ':id/edit', component: RecipeEditComponent},
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
  { path: "signup", component: SignupComponent},
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
