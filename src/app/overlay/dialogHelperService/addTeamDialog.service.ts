// ----------------------- Angular Package References ----------------------------------//
import { Injectable } from '@angular/core';
// --------------------------utilities -----------------------------------------//
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CreateTeamComponent } from 'src/app/home/create-team/create-team.component';

@Injectable()
export class AddTeamDialogService {

  constructor(public dialog: MatDialog) { }

  // --------------------------Local Variable -----------------------------------------//

  createTeamDialogRef: MatDialogRef<CreateTeamComponent, any>;
  // --------------------------Overlay -----------------------------------------//
  
  openAddTeamsHandler(event) {
    if (this.createTeamDialogRef == null) {
      this.createTeamDialogRef = this.dialog.open(CreateTeamComponent, {
        closeOnNavigation: true,
        data: {
          showOverlay: true
        },
        autoFocus: false
      });
    }

    this.createTeamDialogRef.beforeClosed().subscribe(result => {
      this.createTeamDialogRef = null;
    });
  }

  closeDialog(){
    this.createTeamDialogRef?.close();
  }

}
