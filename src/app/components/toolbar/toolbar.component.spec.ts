import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  const appTitle = 'Jobsity Reminder';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToolbarComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should have title '${appTitle}'`, () => {
    expect(component.appTitle).toEqual(appTitle);
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.toolbar h1.title').textContent).toContain(appTitle);
  });

  it('should have a link to Jobsity page', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.toolbar a.jobsity-link').href).toContain('jobsity.com');
  });

  it('should have a link to github code', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.toolbar a.code-link').href).toContain('github.com/thiagobitencourt/jobsity-reminder');
  });
});
