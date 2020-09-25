import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let appTitle = 'Jobsity reminder';

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

  it(`should have title 'Jobsity reminder'`, () => {
    expect(component.appTitle).toEqual(appTitle);
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.toolbar span').textContent).toContain(appTitle);
  });

  it('should have a link to github code', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.toolbar a').href).toContain('github.com/thiagobitencourt/jobsity-reminder');
  });
});
