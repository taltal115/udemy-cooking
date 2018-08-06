import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private authService:AuthService) { }

  ngOnInit() {
  }

  onLoadServer(num: number) {
    // do something
    console.log('navigate');
    this.router.navigate(['/servers', num, 'edit'], {queryParams: {mode: 'editing'}, fragment: 'loading'});
  }

  onLogin() {
    this.authService.login();
  }

  onLogout() {
    this.authService.loggout();
  }
}
