import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTripComponent } from './map-trip.component';

describe('MapTripComponent', () => {
  let component: MapTripComponent;
  let fixture: ComponentFixture<MapTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapTripComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
