import { Component } from '@angular/core';
import { DialogService } from './services/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  initialMonth = new Date();
  currentMonth = new Date();

  constructor(private dialogService: DialogService) {}

  newReminder() {
    this.dialogService.openReminderDialog().subscribe(() => {});
  }
}
