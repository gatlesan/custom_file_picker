import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileCustPickerComponent } from './file-cust-picker.component';

describe('FileCustPickerComponent', () => {
  let component: FileCustPickerComponent;
  let fixture: ComponentFixture<FileCustPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileCustPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileCustPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
