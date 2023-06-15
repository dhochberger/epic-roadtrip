import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { HomeComponent } from './Components/home/home.component';
import { HomeSearchBarComponent } from './Components/home/home-search-bar/home-search-bar.component';
import { RegionMenuComponent } from './Components/home/region-menu/region-menu.component';
import { FooterComponent } from './Components/footer/footer.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { AlertComponent } from './Components/alert/alert.component';
import { AccountComponent } from './Components/account/account.component';

import { ErrorInterceptor } from './helpers';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RestaurantComponent } from './Components/restaurant/restaurant.component';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MapsComponent } from './Components/home/maps/maps.component';

import { GoogleMapsModule } from '@angular/google-maps';
import { TripComponent } from './Components/trip/trip.component';
import { MapTripComponent } from './Components/trip/map-trip/map-trip.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    HomeSearchBarComponent,
    RegionMenuComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent,
    AccountComponent,
    RestaurantComponent,
    MapsComponent,
    TripComponent,
    MapTripComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    GooglePlaceModule,
    GoogleMapsModule
  ],

  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
