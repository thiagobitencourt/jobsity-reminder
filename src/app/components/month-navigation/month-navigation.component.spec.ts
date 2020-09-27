import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthNavigationComponent } from './month-navigation.component';

describe('MonthNavigationComponent', () => {
  let component: MonthNavigationComponent;
  let fixture: ComponentFixture<MonthNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthNavigationComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
