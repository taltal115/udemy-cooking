import { Component } from '@angular/core';
import {UsersService} from "./users.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UsersService]
})
export class AppComponent {
  // constructor(private usersService: UsersService) {}
  // activeUsers: string[] = this.usersService.activeUsers;
  // inactiveUsers: string[] = this.usersService.inactiveUsers;
  //
  // onSetToInactive(id: number) {
  //   this.usersService.inactivate(id);
  // }
  //
  // onSetToActive(id: number) {
  //   this.usersService.activate(id);
  // }
}
