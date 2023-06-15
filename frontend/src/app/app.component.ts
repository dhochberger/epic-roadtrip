import { Component } from '@angular/core';

import { UserService } from './services';
import  { User } from './models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser : User;

  constructor(
    private router: Router,
    private userService : UserService
  ){
    this.userService.currentUser.subscribe(user=>this.currentUser=user);
  }
}
