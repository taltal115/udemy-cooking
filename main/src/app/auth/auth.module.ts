import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModules} from '../shared/shared.modules';
import {SignupComponent} from './signup/signup.component';
import {SigninComponent} from './signin/signin.component';

@NgModule({
  declarations: [
    SignupComponent,
    SigninComponent
  ],
  imports: [
    CommonModule, //Must be here
    FormsModule,
    SharedModules
  ],
})
export class AuthModule {}
