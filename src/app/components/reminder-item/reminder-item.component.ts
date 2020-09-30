import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Reminder } from 'src/app/models/reminder';

@Component({
  selector: 'app-reminder-item',
  templateUrl: './reminder-item.component.html',
  styleUrls: ['./reminder-item.component.scss']
})
export class ReminderItemComponent implements OnInit {
  @Input() isMobile = false;
  @Input() reminder: Reminder;
  @Output() reminderClick = new EventEmitter<Reminder>();
  @Output() remove = new EventEmitter<Reminder>();

  constructor() {}
  ngOnInit(): void {}

  clickReminder() {
    this.reminderClick.emit(this.reminder);
  }

  removeReminder() {
    this.remove.emit(this.reminder);
  }
}
