import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UserListComponent } from './users-list/users-list.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminService } from './admin.service';
import { AppBootstrapModule } from '../shared/app-bootstrap.module';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './State/admin.reducer';
import { AdminEffects } from './State/admin.effects';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MaterialModule } from '../shared/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridMultiSelectComponent } from '../shared/ag-grid-multi-select/ag-grid-multi-select.component';
import { AgGridOfficeDropdownComponent } from '../shared/ag-grid-office-dropdown/ag-grid-office-dropdown.component';
import { PracticeRingfencesComponent } from './practice-ringfences/practice-ringfences.component';

@NgModule({
  declarations: [
    AdminComponent,
    UserListComponent,
    PracticeRingfencesComponent

  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    FormsModule,
    AppBootstrapModule,
    SharedModule,
    MaterialModule,
    MatProgressBarModule,
    StoreModule.forFeature('admin', reducer),
    EffectsModule.forFeature([AdminEffects]),
    AgGridModule.withComponents([AgGridMultiSelectComponent, AgGridOfficeDropdownComponent]),
  ],
  providers: [AdminService]
})
export class AdminModule { }
