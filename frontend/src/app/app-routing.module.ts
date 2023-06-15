import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { AccountComponent } from './Components/account/account.component';
import { RestaurantComponent } from './Components/restaurant/restaurant.component';
import { AuthGuard } from './helpers';
import { TripComponent } from './Components/trip/trip.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'myaccount', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'restaurants', component: RestaurantComponent },
  { path: 'trip', component: TripComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
