import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthAppComponent } from './oauth-app.component';

describe('OauthAppComponent', () => {
  let component: OauthAppComponent;
  let fixture: ComponentFixture<OauthAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OauthAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OauthAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
