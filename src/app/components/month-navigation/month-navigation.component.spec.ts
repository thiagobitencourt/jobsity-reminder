import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { addMonths, format, subMonths } from 'date-fns';

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

  it('should display the current month', () => {
    const month = new Date();
    component.month = month;

    const monthLabel = fixture.debugElement.query(By.css('.month-label'));
    expect(monthLabel.nativeElement.textContent).toBe(format(month, 'MMMM yyyy'));
  });

  it('should be able to navigate to the previous month', () => {
    const month = new Date();
    component.month = month;
    component.previousMonth();
    expect(component.month).toEqual(subMonths(month, 1));
  });

  it('should be able to navigate to the next month', () => {
    const month = new Date();
    component.month = month;
    component.nextMonth();
    expect(component.month).toEqual(addMonths(month, 1));
  });

  it('should emit an event whit the month when the selected month changes', () => {
    spyOn(component.monthChanges, 'emit');
    component.month = new Date();

    component.nextMonth();
    component.previousMonth();
    expect(component.monthChanges.emit).toHaveBeenCalledTimes(2);
    expect(component.monthChanges.emit).toHaveBeenCalledWith(component.month);
  });
});
