import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const baseURL = 'http://localhost:3000/api/v1/users';
const testURL = 'http://localhost:3000/api/v1/trips/hotels?place=48.535360399999995,7.4583286&radius=1000';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  constructor(private http: HttpClient) {}

  getHotel(position: any): Observable<any> {
    console.log(`${baseURL}/hotels/?place=${position.lat},${position.lat}&radius=1000`);
    return this.http.get(`${baseURL}/hotels/?place=${position.lat},${position.lng}&radius=1000`);
  }
}
