import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsOutOfMonthPipe } from 'src/app/pipes/is-out-of-month.pipe';
import { IsTodayPipe } from 'src/app/pipes/is-today.pipe';
import { IsWeekendPipe } from 'src/app/pipes/is-weekend.pipe';

import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsTodayPipe, IsWeekendPipe, IsOutOfMonthPipe, CalendarComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
