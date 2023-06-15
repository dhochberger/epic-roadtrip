import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { TripService } from 'src/app/services/trip/trip.service';
import { HttpClient } from '@angular/common/http';
import { Place } from 'src/app/models/place.model';

const mapUrl = 'http://localhost:3000/api/v1/trips/';
const testURL = 'http://localhost:3000/api/v1/trips/hotels?place=48.535360399999995,7.4583286&radius=1000';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow;

  zoom = 12;
  center: any;
  options: google.maps.MapOptions = {
    minZoom: 8,
    maxZoom: 30
  };
  markers: Place[] = [];
  infoContent = '';
  hotel: any;
  APIdata: any = [];

  marker: any = {
    label: {
      color: 'red',
      text: 'Marker label '
    },
    title: 'Marker title ',
    info: 'Marker info ',
    options: {
      animation: google.maps.Animation.BOUNCE
    }
  };

  @Input() placeType: string;
  @Input() rayon: number;
  @Input() adress: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    });
    if (this.center == null) {
      this.center = { lat: 48.5734053, lng: 7.752111299999999 };
    }
  }

  searchPlace() {
    this.callHotelAPI();
  }

  getPlaces() {
    return this.http.get<any>(
      `${mapUrl}${this.placeType}?place=${this.adress.lat},${this.adress.lng}&radius=${this.rayon}`
    );
  }

  async callHotelAPI() {
    this.markers = [];
    this.center = this.adress;

    const t = await this.getPlaces().toPromise();
    t.data.forEach((p: any) => {
      let hotel: Place = new Place();
      hotel.name = p.name;
      hotel.photo = p.photo;
      hotel.info = p.description;
      hotel.id = p.id
      hotel.position = { lat: p.position.lat, lng: p.position.lon };
      hotel.label = { color: 'black', text: p.name, fontWeight: 'bold' };
      this.markers.push(hotel);
    });
  
    console.log(this.markers);
  }

  logApiData() {
    console.log(this.APIdata);
  }

  logAdress() {
    console.log(this.adress);
  }

  click(event: google.maps.MouseEvent) {
    console.log(event);
  }

  logCenter() {
    console.log(JSON.stringify(this.map.getCenter()));
  }

  addMarker() {
    this.markers.push({
      position: {
        lat: this.center.lat + ((Math.random() - 0.5) * 2) / 10,
        lng: this.center.lng + ((Math.random() - 0.5) * 2) / 10
      }
    });
  }

  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker);
  }
}
