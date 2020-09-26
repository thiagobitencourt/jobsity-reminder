import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ReminderFormComponent } from '../components/reminder-form/reminder-form.component';
import { Reminder } from '../models/reminder';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openReminderDialog(reminder?: Reminder): Observable<Reminder> {
    return this.dialog.open(ReminderFormComponent, { data: { reminder }, panelClass: 'responsive-dialog' }).afterClosed().pipe(take(1));
  }
}
