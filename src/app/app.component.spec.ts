import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { isSameMonth } from 'date-fns';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { DialogService } from './services/dialog.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const dialogService = jasmine.createSpyObj('dialogService', ['openReminderDialog']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: DialogService, useValue: dialogService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the current month', () => {
    expect(isSameMonth(component.currentMonth, new Date())).toBeTrue();
  });

  it('should open the dialog to create a new reminder', () => {
    dialogService.openReminderDialog = jasmine.createSpy('openReminderDialog').and.returnValue(of({}));
    component.newReminder();
    expect(dialogService.openReminderDialog).toHaveBeenCalled();
  });
});
