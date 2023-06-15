import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSearchBarComponent } from './home-search-bar.component';

describe('HomeSearchBarComponent', () => {
  let component: HomeSearchBarComponent;
  let fixture: ComponentFixture<HomeSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSearchBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
