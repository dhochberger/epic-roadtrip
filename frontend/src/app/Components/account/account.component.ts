import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from '../../models/user.model';
import { UserService } from '../../services';
import { Preferences } from 'src/app/models/preferences.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
    currentUser: User;
    currentUserSubscription: Subscription;
    preferencesList?: Preferences[] = [];

    constructor(
        private userService: UserService
    ) { 
        this.currentUserSubscription = this.userService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
        this.preferencesList = JSON.parse(localStorage.getItem('preferencesUser'));
        console.log(this.preferencesList);
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

}
