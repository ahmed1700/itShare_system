import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsCalenderComponent } from './groups-calender.component';

describe('GroupsCalenderComponent', () => {
  let component: GroupsCalenderComponent;
  let fixture: ComponentFixture<GroupsCalenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsCalenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
