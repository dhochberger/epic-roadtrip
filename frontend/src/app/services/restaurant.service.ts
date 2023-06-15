import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { Data } from '../models/data.model';

import { environment } from 'src/environments/environment';


const URL_resto = environment.apiUrl + '/trips/restaurants';

@Injectable({ providedIn: 'root' })
export class RestaurantService {


    constructor(private http: HttpClient) {

    }
    
    //San Franscisco
    restoSanFranscisco(){
        return this.http.get<Data>(`${URL_resto}`, {
            params:{
                place: '37.76999,-122.44696',
                radius:'2500'
            }
        });
    }
}