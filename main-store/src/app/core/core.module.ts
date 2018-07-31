import {NgModule} from "@angular/core";
import {HTTP_INTERCEPTORS} from "@angular/common/http";

import {HomeComponent} from "./home/home.component";
import {HeaderComponent} from "./header/header.component";
import {AppRoutingModule} from "../app-routing.module";
import {SharedModules} from "../shared/shared.modules";
import {AuthService} from "../auth/auth.service";
import {RecipeService} from "../recipes/recipe.service";
import {DataStorageService} from "../shared/data-storage.service";
import {AuthInterceptor} from "../shared/auth.interceptor";
import {LoginInterceptor} from "../shared/login.interceptor";

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent
  ],
  imports: [
    SharedModules,
    AppRoutingModule
  ],
  exports: [
    AppRoutingModule,
    HeaderComponent
  ],
  providers: [
    RecipeService,
    DataStorageService,
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoginInterceptor, multi: true}
  ]
})
export class CoreModule {}
