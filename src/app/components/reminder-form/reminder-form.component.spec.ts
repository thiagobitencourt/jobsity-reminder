import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { format, isThisHour, isThisMinute, isToday, parse } from 'date-fns';
import { of, throwError } from 'rxjs';
import { ForecastService } from 'src/app/services/forecast.service';
import { ReminderService } from 'src/app/services/reminder.service';
import { ReminderFormComponent } from './reminder-form.component';

describe('ReminderFormComponent', () => {
  let component: ReminderFormComponent;
  let fixture: ComponentFixture<ReminderFormComponent>;

  const defaultColor = '#3f51b5';
  const reminderService = jasmine.createSpyObj('reminderService', ['saveReminder']);
  const matDialogRef = jasmine.createSpyObj('matDialogRef', ['close']);
  const forecastService = {
    isForecastSearchableForDate: jasmine.createSpy('isForecastSearchableForDate').and.returnValue(true),
    getForecastCityDate: jasmine.createSpy('getForecastCityDate').and.returnValue({}),
    forecastAvailableInterval: jasmine.createSpy('forecastAvailableInterval').and.returnValue({ start: new Date(), end: new Date() })
  };
  const matDialogData = { reminder: undefined };
  
  beforeEach(async () => {
    matDialogData.reminder = undefined;
    await TestBed.configureTestingModule({
      declarations: [ReminderFormComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: matDialogData },
        { provide: MatDialogRef, useValue: matDialogRef },
        { provide: ReminderService, useValue: reminderService },
        { provide: ForecastService, useValue: forecastService }
      ],
      imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, BrowserAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*
    Ability to add a new "reminder" (max 30 chars) for a user entered day and time. Also, include a city
  */
  it('should load the form with some initial data', () => {
    const initialValues = component.form.getRawValue();
    expect(isToday(initialValues.date)).toBe(true);
    expect(isThisHour(parse(initialValues.hour, 'HH', new Date()))).toBe(true);
    expect(isThisMinute(parse(initialValues.minute, 'mm', new Date()))).toBe(true);
    expect(initialValues.color).toBe(defaultColor);
    expect(initialValues.description).toBeNull();
    expect(initialValues.city).toBeFalsy();
    expect(initialValues.id).toBeFalsy();
  });

  it('should add a new reminder', () => {
    reminderService.saveReminder = jasmine.createSpy('saveReminder').and.returnValue(of({}));
    const datetimeString = format(new Date(), 'MM-dd-yyyy HH:mm');
    const reminderDescription = 'test reminder';

    const reminder = {
      id: null, 
      datetime: parse(datetimeString, 'MM-dd-yyyy HH:mm', new Date()),
      description: reminderDescription,
      city: null,
      color: defaultColor
    }

    component.form.get('description').setValue('test reminder');
    component.save();
    
    expect(reminderService.saveReminder).toHaveBeenCalledWith(reminder);
  });

  it('should not allow to create a reminder without a description', () => {
    reminderService.saveReminder = jasmine.createSpy('saveReminder').and.returnValue(of({}));

    expect(component.form.invalid).toBeTrue();
    component.save();
    expect(reminderService.saveReminder).not.toHaveBeenCalled();

    component.form.get('description').setValue('test description');
    component.save();
    expect(reminderService.saveReminder).toHaveBeenCalled();
  });

  it('should not allow to create a reminder with more than 30 caracters', () => {
    reminderService.saveReminder = jasmine.createSpy('saveReminder');
    component.form.get('description').setValue('create a reminder description with more then 30 characters long');
    fixture.detectChanges();

    expect(component.form.invalid).toBeTrue();
    component.save();
    expect(reminderService.saveReminder).not.toHaveBeenCalled();
  });

  it('should not allow to create a reminder without a date', () => {
    reminderService.saveReminder = jasmine.createSpy('saveReminder');
    component.form.get('description').setValue('test description');
    component.form.get('date').setValue(null);
    fixture.detectChanges();

    expect(component.form.invalid).toBeTrue();
    component.save();
    expect(reminderService.saveReminder).not.toHaveBeenCalled();
  });

  it('should not allow to create a reminder without time', () => {
    reminderService.saveReminder = jasmine.createSpy('saveReminder');
    component.form.get('description').setValue('test description');
    component.form.get('hour').setValue(null);
    fixture.detectChanges();
    
    expect(component.form.invalid).toBeTrue();
    component.save();
    expect(reminderService.saveReminder).not.toHaveBeenCalled();

    component.form.get('hour').setValue('10');
    component.form.get('minute').setValue(null);
    fixture.detectChanges();

    expect(component.form.invalid).toBeTrue();
    component.save();
    expect(reminderService.saveReminder).not.toHaveBeenCalled();
  });

  it('should set up a reminder into the form when editing', () => {
    const datetime = new Date();
    const reminder = {
      id: '12345',
      datetime,
      description: 'test reminder',
      city: 'London',
      color: '#cccccc'
    };

    const rawData = {
      id: reminder.id,
      date: reminder.datetime,
      hour: format(reminder.datetime, 'HH'),
      minute: format(reminder.datetime, 'mm'),
      description: reminder.description,
      city: reminder.city,
      color: reminder.color
    };

    forecastService.getForecastCityDate = jasmine.createSpy('getForecastCityDate').and.returnValue(of({}));
    matDialogData.reminder = reminder;

    const temFixture = TestBed.createComponent(ReminderFormComponent);
    const tempComponent = temFixture.componentInstance;
    temFixture.detectChanges();

    expect(tempComponent.form.valid).toBeTrue();
    expect(tempComponent.form.getRawValue()).toEqual(rawData);
  });

  it('should display a remove button when editing a reminder', () => {
    matDialogData.reminder = { id: '12345', datetime: new Date(), description: 'test reminder' };

    const temFixture = TestBed.createComponent(ReminderFormComponent);
    const tempComponent = temFixture.componentInstance;
    temFixture.detectChanges();

    const removeButton = temFixture.debugElement.query(By.css('button[color="warn"]'));

    expect(tempComponent.form.get('id').value).toBe('12345');
    expect(removeButton).toBeTruthy();
  });

  it('should load the weather forecast for a city and date', fakeAsync(() => {
    forecastService.isForecastSearchableForDate = jasmine.createSpy('isForecastSearchableForDate').and.returnValue(true);
    forecastService.getForecastCityDate = jasmine.createSpy('getForecastCityDate').and.returnValue(of({}));

    const cityName = 'London';
    const date = component.form.get('date').value;

    component.form.get('city').setValue(cityName);
    tick(600);
    expect(forecastService.isForecastSearchableForDate).toHaveBeenCalled();
    expect(forecastService.getForecastCityDate).toHaveBeenCalledWith(cityName, date);
  }));

  it('should display the weather forecast for user', fakeAsync(() => {
    const cityName = 'London';
    const date = component.form.get('date').value;

    const testForecast = {
      date,
      city: cityName,
      main: 'Rain',
      description: 'It is raining a lot',
      icon: 'icon-test'
    };

    forecastService.isForecastSearchableForDate = jasmine.createSpy('isForecastSearchableForDate').and.returnValue(true);
    forecastService.getForecastCityDate = jasmine.createSpy('getForecastCityDate').and.returnValue(of(testForecast));

    component.form.get('city').setValue(cityName);
    tick(600);
    expect(forecastService.getForecastCityDate).toHaveBeenCalledWith(cityName, date);

    fixture.detectChanges();
    expect(component.forecast).toEqual(testForecast);
    const forecastMessage = fixture.debugElement.query(By.css('.forecast-message .forecast'));
    expect(forecastMessage.nativeElement.textContent).toContain(`${testForecast.main}, ${testForecast.description}`);
  }));

  it('should display a message when the weather forecast is not allowed for the selected date', fakeAsync(() => {
    forecastService.isForecastSearchableForDate = jasmine.createSpy('isForecastSearchableForDate').and.returnValue(false);

    component.form.get('city').setValue('London');

    expect(component.forecastNoAvailable).toBeFalse();
    tick(600);

    expect(forecastService.isForecastSearchableForDate).toHaveBeenCalled();
    expect(component.forecastNoAvailable).toBeTrue();

    fixture.detectChanges();
    const forecastMessage = fixture.debugElement.query(By.css('.forecast-message'));
    expect(forecastMessage.nativeElement.textContent).toContain(component.forecastNoAvailableMessage);
  }));

  it('should display a message when the weather forecast was not found for the given city name', fakeAsync(() => {
    forecastService.isForecastSearchableForDate = jasmine.createSpy('isForecastSearchableForDate').and.returnValue(true);
    forecastService.getForecastCityDate = jasmine.createSpy('getForecastCityDate').and.returnValue(throwError(null));

    component.form.get('city').setValue('London');
    expect(component.forecastNoFound).toBeFalse();
    tick(600);

    expect(forecastService.getForecastCityDate).toHaveBeenCalled();
    expect(component.forecastNoFound).toBeTrue();

    fixture.detectChanges();
    const forecastMessage = fixture.debugElement.query(By.css('.forecast-message'));
    expect(forecastMessage.nativeElement.textContent).toContain(component.forecastNoFoundMessage);
  }));

  it('should not display any weather forecast message when there are no date nor city name', fakeAsync(() => {
    forecastService.isForecastSearchableForDate = jasmine.createSpy('isForecastSearchableForDate').and.returnValue(true);
    forecastService.getForecastCityDate = jasmine.createSpy('getForecastCityDate').and.returnValue(of({}));

    component.form.get('city').setValue(null);
    tick(600);

    expect(forecastService.isForecastSearchableForDate).not.toHaveBeenCalled();
    expect(component.forecastNoAvailable).toBeFalse();
    expect(component.forecastNoFound).toBeFalse();
    expect(component.forecast).toBeNull();

    fixture.detectChanges();
    const forecastMessage = fixture.debugElement.query(By.css('.forecast-message'));
    expect(forecastMessage.nativeElement.textContent).toBeFalsy();
  }));

  it('should display the correct dialog title when adding a reminder', () => {
    const newReminderTitle = 'New reminder';

    const labelTitleElement = fixture.debugElement.query(By.css('h2[mat-dialog-title]'));
    expect(component.labelTitle).toBe(newReminderTitle);
    expect(labelTitleElement.nativeElement.textContent).toBe(newReminderTitle);
  });

  it('should display the correct dialog title editing an existing reminder', () => {
    const editReminderTitle = 'Edit reminder';
    matDialogData.reminder = { id: '12345', datetime: new Date(), description: 'test reminder' };

    const temFixture = TestBed.createComponent(ReminderFormComponent);
    const tempComponent = temFixture.componentInstance;
    temFixture.detectChanges();

    const labelTitleElement = temFixture.debugElement.query(By.css('h2[mat-dialog-title]'));
    expect(tempComponent.labelTitle).toBe(editReminderTitle);
    expect(labelTitleElement.nativeElement.textContent).toBe(editReminderTitle);
  });
});
