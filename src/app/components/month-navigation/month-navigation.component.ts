import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { addMonths, subMonths } from 'date-fns';

@Component({
  selector: 'app-month-navigation',
  templateUrl: './month-navigation.component.html',
  styleUrls: ['./month-navigation.component.scss']
})
export class MonthNavigationComponent implements OnInit {
  @Input() month: Date;
  @Output() monthChanges = new EventEmitter<Date>();

  constructor() {}
  ngOnInit(): void {
    this.month = this.month || new Date();
  }

  previousMonth() {
    this.month = subMonths(this.month, 1);
    this.emit();
  }

  nextMonth() {
    this.month = addMonths(this.month, 1);
    this.emit();
  }

  private emit() {
    this.monthChanges.emit(this.month);
  }
}
