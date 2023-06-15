import { Component, OnInit, Input } from '@angular/core';
import { Place } from 'src/app/models/place.model';

@Component({
  selector: 'app-region-menu',
  templateUrl: './region-menu.component.html',
  styleUrls: ['./region-menu.component.css']
})
export class RegionMenuComponent implements OnInit {

  constructor() { }

  @Input() place: Place;

  ngOnInit(): void {
  }

}
