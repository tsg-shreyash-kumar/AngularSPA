import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  exports: [
    MatExpansionModule,
    DragDropModule,
    MatCheckboxModule,
    MatDialogModule,
    ScrollingModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    ClipboardModule,
    MatCardModule,
    MatProgressBarModule
  ],
  imports: [
    MatExpansionModule,
    DragDropModule,
    MatCheckboxModule,
    MatDialogModule,
    ScrollingModule,
    MatDividerModule,
    MatListModule,
    ClipboardModule,
    MatCardModule,
    MatProgressBarModule
  ]
})
export class MaterialModule { }
