import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { IsTodayPipe } from './pipes/is-today.pipe';
import { IsWeekendPipe } from './pipes/is-weekend.pipe';
import { IsOutOfMonthPipe } from './pipes/is-out-of-month.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    CalendarComponent,
    IsTodayPipe,
    IsWeekendPipe,
    IsOutOfMonthPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
