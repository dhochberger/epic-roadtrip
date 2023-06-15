import { Component, OnInit } from '@angular/core';

import { RestaurantService } from 'src/app/services';
import { Restaurant } from 'src/app/models/restaurant.model';


@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  restoList: Restaurant[] = [];
  slides: any = [];

  constructor(
    private restoService: RestaurantService
  ) { }

  ngOnInit(): void {
    this.listRestoSanFrancisco();
  }

  listRestoSanFrancisco(){
    this.restoService.restoSanFranscisco()
    .subscribe(response => {
      for (let i=0; i<response.data.length; i++){
        this.restoList.push({
          name: response.data[i].name,
          description: response.data[i].description,
          photo: response.data[i].photo
        })
      }
      for (let j=0, len= this.restoList.length; j<len; j += 3){
        this.slides.push(this.restoList.slice(j, j+3));
      }
      console.log("slides[] " + this.slides);
      console.log( this.restoList.slice(0,6));
      console.log("test() " + this.restoList[0])
    });
  }

}
