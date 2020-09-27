import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { format, parse } from 'date-fns';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Forecast } from 'src/app/models/forecast';
import { Reminder } from 'src/app/models/reminder';
import { ForecastService } from 'src/app/services/forecast.service';
import { ReminderService } from 'src/app/services/reminder.service';

@Component({
  selector: 'app-reminder-form',
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss']
})
export class ReminderFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  maxDesciption = 30;
  hours = this.getNumberList(23);
  minutes = this.getNumberList(59);
  labelTitle: string;
  forecastNoAvailableMessage: string;
  forecastNoAvailable = false;
  forecastNoFoundMessage: string;
  forecastNoFound = false;
  forecast: Forecast;

  private subscriptions = new Subscription();
  private readonly newReminderLabel = 'New reminder';
  private readonly editReminderLabel = 'Edit reminder';
  private reminder: Reminder;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ReminderFormComponent>,
    private formBuilder: FormBuilder,
    private reminderService: ReminderService,
    private forecastService: ForecastService
  ) {
    this.reminder = this.data && this.data.reminder;
    this.labelTitle = this.reminder ? this.editReminderLabel : this.newReminderLabel;
  }

  ngOnInit(): void {
    this.setForm(this.reminder || this.reminderInitialValues());
    this.setUpMessages();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  save() {
    if (this.form.valid) {
      const { id, description, city, color, ...formValue } = this.form.getRawValue();
      const datetime = this.parseDatetimeValue(formValue);
      const reminder: Reminder = { id, description, datetime, city, color };

      this.subscriptions.add(
        this.reminderService.saveReminder(reminder).subscribe(() => {
          this.dialogRef.close(reminder);
        })
      );
    }
  }

  remove() {
    if (this.reminder.id) {
      this.subscriptions.add(
        this.reminderService.removeReminder(this.reminder).subscribe(() => {
          this.dialogRef.close(this.reminder);
        })
      );
    }
  }

  private setForm(reminder: Reminder) {
    this.form = this.formBuilder.group({
      id: [reminder.id],
      description: [reminder.description, [Validators.required, Validators.maxLength(this.maxDesciption)]],
      date: [reminder.datetime, Validators.required],
      hour: [this.getFormatedTime(reminder.datetime, 'HH'), Validators.required],
      minute: [this.getFormatedTime(reminder.datetime, 'mm'), Validators.required],
      city: [reminder.city],
      color: [reminder.color]
    });

    this.subscriptions.add(this.form.get('city').valueChanges.pipe(debounceTime(300)).subscribe(this.loadCityDateForecast.bind(this)));
    this.subscriptions.add(this.form.get('date').valueChanges.pipe(debounceTime(300)).subscribe(this.loadCityDateForecast.bind(this)));
  }

  private loadCityDateForecast() {
    const date = this.form.get('date').value;
    const cityName = this.form.get('city').value;

    this.forecastNoAvailable = false;
    this.forecastNoFound = false;
    this.forecast = null;

    if (cityName && date) {
      if (this.forecastService.isForecastSearchableForDate(date)) {
        this.subscriptions.add(
          this.forecastService.getForecastCityDate(cityName, date)
            .subscribe((forecast: Forecast) => {
              console.log(forecast);
              this.forecast = forecast;
            }, () => {
              this.forecastNoFound = true;
            })
        );
      } else {
        this.forecastNoAvailable = true;
      }
    }
  }

  private setUpMessages() {
    const { start, end } = this.forecastService.forecastAvailableInterval();
    this.forecastNoAvailableMessage = `Weather forecast only available from ${format(start, 'MM-dd-yyyy')} to ${format(end, 'MM-dd-yyyy')}.`;
    this.forecastNoFoundMessage = 'Weather forecast not available for this city.';
  }

  private parseDatetimeValue({ date, hour, minute }) {
    const dateString = format(new Date(date), 'MM-dd-yyyy');
    return parse(`${dateString} ${hour}:${minute}`, 'MM-dd-yyyy HH:mm', new Date());
  }

  private reminderInitialValues(): Reminder {
    return { description: null, datetime: new Date(), color: '#3f51b5' };
  }

  private getFormatedTime(datetime: Date, pattern: string): string {
    return format(new Date(datetime), pattern);
  }

  private getNumberList(size): string[] {
    const numberList = [];
    for (let i = 0; i <= size; i++) {
      numberList.push(i <= 9 ? `0${i}` : `${i}`);
    }
    return numberList;
  }
}
