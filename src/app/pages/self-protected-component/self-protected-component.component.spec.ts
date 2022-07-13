import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfProtectedComponentComponent } from './self-protected-component.component';

describe('SelfProtectedComponentComponent', () => {
  let component: SelfProtectedComponentComponent;
  let fixture: ComponentFixture<SelfProtectedComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfProtectedComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelfProtectedComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
