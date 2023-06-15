import { Component, OnInit } from '@angular/core';
import { MapTripComponent } from './map-trip/map-trip.component';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {
  center: any = { lat: 48.5734053, lng: 7.752111299999999 };
  defaultBounds: any = {
    north: this.center.lat + 0.1,
    south: this.center.lat - 0.1,
    east: this.center.lng + 0.1,
    west: this.center.lng - 0.1
  };
  options = {
    bounds: this.defaultBounds,
    fields: ['address_components', 'geometry', 'icon', 'name'],
    origin: this.center,
    strictBounds: false,
    types: ['(regions)'],
    componentRestrictions: { country: "FR" }
  };

  addressStart: any;
  addressEnd: any;

  constructor() {}

  ngOnInit(): void {}

  handleStartAddressChange(adress: any) {
    let position = adress.geometry.location;
    this.addressStart = { lat: position.lat(), lng: position.lng() };
  }

  handleEndAddressChange(adress: any) {
    let position = adress.geometry.location;
    this.addressEnd = { lat: position.lat(), lng: position.lng() };
  }
}
