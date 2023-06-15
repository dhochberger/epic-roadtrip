import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isLogged:string;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.isLogged = localStorage.getItem('isLogged');
    console.log('isLogged in NavBar : ' + localStorage.getItem('isLogged'));
  }

  logout(){
    this.userService.logout();
    this.router.navigate([''])
    .then(() => {
      window.location.reload();
    });
  }

}
