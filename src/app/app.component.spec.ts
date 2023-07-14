import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { EmployeeProfileComponent } from './core/employee-profile/employee-profile.component';
import { MockCoreService } from './shared/mocks/mock-core-service'
import { CoreService } from './core/core.service';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        PopoverModule,
        MatDialogModule,
        ModalModule.forRoot(),
        ToastrModule.forRoot()
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        EmployeeProfileComponent
      ],
    });
    TestBed.overrideComponent(AppComponent, {
      set: {
        providers: [
          { provide: CoreService, useClass: MockCoreService },
          BsModalService

        ]
      }
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'staffing'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('staffing');
  });
});
