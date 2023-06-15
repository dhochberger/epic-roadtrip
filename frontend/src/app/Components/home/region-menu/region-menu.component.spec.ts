import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionMenuComponent } from './region-menu.component';

describe('RegionMenuComponent', () => {
  let component: RegionMenuComponent;
  let fixture: ComponentFixture<RegionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegionMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
