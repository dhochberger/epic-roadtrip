import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const testURL = "http://localhost:3000/api/v1/trips/directions?destination=strasbourg&origin=colmar"

@Component({
  selector: 'app-map-trip',
  templateUrl: './map-trip.component.html',
  styleUrls: ['./map-trip.component.css']
})
export class MapTripComponent implements OnInit {

  @Input() addressStart: any;
  @Input() addressEnd: any;
  
  center: any
  direction: any
  zoom: number = 5

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
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

async getDirection(){
  this.direction = null
  const t = await this.getDirectionApi().toPromise();
  this.direction = t.data;
  console.log(this.direction)


  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();

    const map = new google.maps.Map(document.getElementById("map-trip"));
    let result
    debugger;
    directionsRenderer.setMap(map);
    directionsRenderer.setDirections(t.data);

}

getDirectionApi(){
  return this.http.get<any>(`${testURL}`)
}

// async callHotelAPI() {
//   this.markers = []
//   this.center = this.adress

//   const t = await this.getPlaces().toPromise();
//   t.data.forEach((p:any) => {
//     let hotel: Place = new Place()
//     hotel.name = p.name
//     hotel.position = {lat : p.position.lat, lng: p.position.lon}
//     hotel.label = { color: "black", text: p.name, fontWeight: "bold"}
//     this.markers.push(hotel)
//   });
//   console.log(this.markers)
// }

}
