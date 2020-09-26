import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { format, parse } from 'date-fns';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Reminder } from 'src/app/models/reminder';
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
  
  private subscriptions = new Subscription();
  private readonly newReminderLabel = 'New reminder';
  private readonly editReminderLabel = 'Edit reminder';
  private reminder: Reminder;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ReminderFormComponent>,
    private formBuilder: FormBuilder,
    private reminderService: ReminderService
  ) {
    this.reminder = this.data && this.data.reminder;
    this.labelTitle = this.reminder ? this.editReminderLabel : this.newReminderLabel;
  }

  ngOnInit(): void {
    this.setForm(this.reminder || this.reminderInitialValues());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  save() {
    if (this.form.valid) {
      const { id, description, city, color, ...formValue } = this.form.getRawValue();
      const datetime = this.parseDatetimeValue(formValue);
      const reminder: Reminder = { id, description, datetime, city, color };

      this.reminderService.saveReminder(reminder).subscribe(() => {
        this.dialogRef.close(reminder);
      });
    }
  }

  private loadCityForecast(cityName: string) {
    // @TODO - Load forecast
    console.log('Load forecast for selected city: ', cityName);
  }

  private setForm(reminder: Reminder) {
    this.form = this.formBuilder.group({
      id: [reminder.id],
      description: [reminder.description, [Validators.required, Validators.maxLength(this.maxDesciption)]],
      date: [reminder.datetime, Validators.required],
      hour: [format(reminder.datetime, 'HH'), Validators.required],
      minute: [format(reminder.datetime, 'mm'), Validators.required],
      city: [reminder.city],
      color: [reminder.color]
    });

    this.subscriptions.add(
      this.form.get('city').valueChanges.pipe(debounceTime(300)).subscribe(this.loadCityForecast.bind(this))
    );
  }

  private parseDatetimeValue({ date, hour, minute }) {
    const dateString = format(date, 'MM-dd-yyyy');
    return parse(`${dateString} ${hour}:${minute}`, 'MM-dd-yyyy HH:mm', new Date());
  }

  private reminderInitialValues(): Reminder {
    return { description: null, datetime: new Date(), color: '#3f51b5' };
  }

  private getNumberList(size): string[] {
    const numberList = [];
    for (let i = 0; i <= size; i++) {
      numberList.push(i <= 9 ? `0${i}` : `${i}`);
    }
    return numberList;
  }
}
