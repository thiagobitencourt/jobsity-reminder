import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { IsTodayPipe } from './pipes/is-today.pipe';
import { IsWeekendPipe } from './pipes/is-weekend.pipe';
import { IsOutOfMonthPipe } from './pipes/is-out-of-month.pipe';
import { ReminderFormComponent } from './components/reminder-form/reminder-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReminderItemComponent } from './components/reminder-item/reminder-item.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    CalendarComponent,
    IsTodayPipe,
    IsWeekendPipe,
    IsOutOfMonthPipe,
    ReminderFormComponent,
    ReminderItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Angular Material Modules
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
