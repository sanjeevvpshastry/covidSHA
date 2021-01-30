import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountByCountryComponent } from './count-by-country.component';

describe('CountByCountryComponent', () => {
  let component: CountByCountryComponent;
  let fixture: ComponentFixture<CountByCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountByCountryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountByCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
