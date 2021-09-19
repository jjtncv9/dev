import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page1infoComponent } from './page1info.component';

describe('Page1infoComponent', () => {
  let component: Page1infoComponent;
  let fixture: ComponentFixture<Page1infoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Page1infoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Page1infoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
