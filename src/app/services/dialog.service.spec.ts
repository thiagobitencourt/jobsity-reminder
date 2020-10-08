import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ReminderFormComponent } from '../components/reminder-form/reminder-form.component';

import { DialogService } from './dialog.service';

describe('DialogService', () => {
  let service: DialogService;

  const afterClose = { afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of({})) };
  const dialogService = { open: jasmine.createSpy('open').and.returnValue(afterClose) };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ { provide: MatDialog, useValue: dialogService }]
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open the dialog for the "ReminderFormComponent" component', () => {
    service.openReminderDialog().subscribe(() => {
      expect(dialogService.open).toHaveBeenCalledWith(ReminderFormComponent, { data: { reminder: undefined }, panelClass: 'responsive-dialog' });
    });
  });

  it('should open the dialog with the given reminder', () => {
    const reminder = { datetime: new Date(), description: 'reminder test' };
    service.openReminderDialog(reminder).subscribe(() => {
      expect(dialogService.open).toHaveBeenCalledWith(ReminderFormComponent, { data: { reminder }, panelClass: 'responsive-dialog' });
    });
  });
});
