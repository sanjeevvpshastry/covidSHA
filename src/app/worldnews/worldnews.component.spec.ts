import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldnewsComponent } from './worldnews.component';

describe('WorldnewsComponent', () => {
  let component: WorldnewsComponent;
  let fixture: ComponentFixture<WorldnewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorldnewsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldnewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
