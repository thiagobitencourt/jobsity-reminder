import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { format } from 'date-fns';
import { ReminderItemComponent } from './reminder-item.component';

describe('ReminderItemComponent', () => {
  let component: ReminderItemComponent;
  let fixture: ComponentFixture<ReminderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReminderItemComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.reminder = { description: 'Test reminder', datetime: new Date() };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the reminder description', () => {
    component.reminder = { datetime: new Date(), description: 'reminder test' };
    fixture.detectChanges();
    const reminderLabel = fixture.debugElement.query(By.css('.reminder-item .label'));
    expect(reminderLabel.nativeElement.textContent).toContain('reminder test');
  });

  it('should display the reminder time', () => {
    const reminder = { datetime: new Date(), description: 'reminder test' };
    component.reminder = reminder;
    fixture.detectChanges();
    const reminderLabel = fixture.debugElement.query(By.css('.reminder-item .time'));
    expect(reminderLabel.nativeElement.textContent).toContain(format(reminder.datetime, 'HH:mm'));
  });

  it('should render the reminder color style', () => {
    const reminder = { color: '#cccccc', datetime: new Date(), description: 'reminder test' };
    component.reminder = reminder;
    fixture.detectChanges();
    const reminderLabel = fixture.debugElement.query(By.css('.reminder-item .color'));
    expect(reminderLabel.nativeElement.style.background).toBeTruthy();
  });

  it('should have a remove reminder action', () => {
    const reminder = { datetime: new Date(), description: 'reminder test' };
    component.reminder = reminder;
    fixture.detectChanges();
    const reminderLabel = fixture.debugElement.query(By.css('.reminder-item .remove'));
    expect(reminderLabel).toBeTruthy();
  });

  it('should emit the remove event on click the remove action', () => {
    component.reminder = { datetime: new Date(), description: 'reminder test' };

    spyOn(component.reminderClick, 'emit');
    component.clickReminder();
    expect(component.reminderClick.emit).toHaveBeenCalledWith(component.reminder);
  });

  it('should emit the edit event on click the reminder', () => {
    component.reminder = { datetime: new Date(), description: 'reminder test' };

    spyOn(component.remove, 'emit');
    component.removeReminder();
    expect(component.remove.emit).toHaveBeenCalledWith(component.reminder);
  });

  it('should display the weather forecast icon when forecast information is available', () => {
    const forecast = { date: new Date(), main: 'Rain', description: 'Rains a lot', city: 'London', icon: 'test-icon' };
    const reminder = { datetime: new Date(), description: 'reminder test', forecast };
    component.reminder = reminder;

    fixture.detectChanges();
    const forecastIcon = fixture.debugElement.query(By.css('.reminder-item img.forecast'));
    expect(forecastIcon.attributes.src).toContain('test-icon.png');
  });
});
