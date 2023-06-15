import { Component, OnInit, ViewChild } from '@angular/core';
import { MapsComponent } from '../maps/maps.component';

import { Preferences } from 'src/app/models/preferences.model';
import { HighContrastModeDetector } from '@angular/cdk/a11y';
import { Jsonp } from '@angular/http';

@Component({
  selector: 'app-home-search-bar',
  templateUrl: './home-search-bar.component.html',
  styleUrls: ['./home-search-bar.component.css']
})
export class HomeSearchBarComponent implements OnInit {
  @ViewChild(MapsComponent) mapscmp: MapsComponent;

  preferencesList: Preferences[] = JSON.parse(localStorage.getItem('preferencesUser'))

  constructor() {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      this.adress = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    });

    this.ChangePointInteret('');
    this.ChangeRayon(1000);
  }

  ////#region Variables
  name: string = '';
  adress: any;
  rayon: number;
  placeType: string = '';

  rayonlabel: string;
  center: any = { lat: 48.5734053, lng: 7.752111299999999 };

  ////#endregion

  //#region Options par défaut de la barre de recherche

  // Create a bounding box with sides ~10km away from the center point
  defaultBounds: any = {
    north: this.center.lat + 0.1,
    south: this.center.lat - 0.1,
    east: this.center.lng + 0.1,
    west: this.center.lng - 0.1
  };
  input = document.getElementById('pac-input') as HTMLInputElement;
  options = {
    bounds: this.defaultBounds,
    componentRestrictions: { country: 'FR' },
    fields: ['address_components', 'geometry', 'icon', 'name'],
    origin: this.center,
    strictBounds: false,
    types: ['(cities)']
  };

  //#endregion

  handleAddressChange(adress: any) {
    let position = adress.geometry.location;
    this.adress = { lat: position.lat(), lng: position.lng() };
  }

  ChangePointInteret(lieu: string) {
    // Les différentss types possibles
    // https://developers.google.com/maps/documentation/places/web-service/supported_types

    switch (lieu) {
      case 'restaurants': {
        this.placeType = 'Restaurants';
        break;
      }
      case 'establishment': {
        this.placeType = 'Hotels';
        break;
      }
      case 'bars': {
        this.placeType = 'Bars';
        break;
      }
      case 'transports': {
        this.placeType = 'Transports';
        break;
      }
      default: {
        this.placeType = 'Restaurants';
        break;
      }
    }
  }

  ChangeRayon(rayon: number) {
    switch (rayon) {
      case 1000: {
        this.rayon = 1000;
        this.rayonlabel = '1 KM';
        break;
      }
      case 3000: {
        this.rayon = 3000;
        this.rayonlabel = '3 KM';
        break;
      }
      case 5000: {
        this.rayon = 5000;
        this.rayonlabel = '5 KM';
        break;
      }
      default: {
        this.rayon = 1000;
        this.rayonlabel = '1 KM';
        break;
      }
    }
  }

  getPlace() {
    console.log(google.maps.places.AutocompleteService);
  }

  logType() {
    console.log(this?.placeType);
    console.log(this.rayon);
    console.log(this.adress);
  }

  findPlaces() {
    this.mapscmp.searchPlace();
  }

  addPreference(){
    console.log("addPreference");
    this.preferencesList.push({
      placeType : this?.placeType,
      rayon : this.rayon,
      adress: {
        lat: this.adress.lat,
        long: this.adress.lng
      }
    });
    console.log(this.preferencesList);
    localStorage.setItem('preferencesUser',JSON.stringify(this.preferencesList));

  }
}
