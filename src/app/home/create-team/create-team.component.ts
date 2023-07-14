// -------------------Angular Operators---------------------------------------//
import { Component, OnInit, Output, EventEmitter, ViewChild, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-home-create-team',
  templateUrl: './create-team.component.html',
  styleUrls: ['./create-team.component.scss']
})
export class CreateTeamComponent implements OnInit {
  // -----------------------Input Variables--------------------------------------------//
  // teamname = 'Create Team Name';
  // pageHeader = 'Create New Team';
  // showOverlay: boolean;

  // // Todo: Remove this Mock Data once actual data is available //
  // companyhistory = [
  //   {
  //     company: 'Allocated to CVS Farmacy',
  //     startdate: '01-Jun-2019',
  //     enddate: '31-Jun-2019'
  //   },
  //   {
  //     company: 'Allocated to Rite Aid PEG',
  //     startdate: '20-Mar-2019',
  //     enddate: '28-Mar-2019'
  //   },
  //   {
  //     company: 'Allocated to Merck Pharmaceuticals',
  //     startdate: '01-Jan-2019',
  //     enddate: '28-Feb-2019'
  //   }
  // ];

  // // -----------------------Output Events--------------------------------------------//
  // @Output() closeTeamsPage = new EventEmitter<any>();


  // constructor(public dialogRef: MatDialogRef<CreateTeamComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: any) {
  //     this.dialogRef.disableClose = true; // dialogRef property set to disable dialogBox from closing using esc button.
  //     this.showOverlay = this.data.showOverlay;
  // }
  // -----------------------Component LifeCycle Events and Functions-------------------//
  ngOnInit() { }

  // -----------------------Output Event Handlers-----------------------------------//
  // closeTeams() {
  //   const self = this;

  //   self.showOverlay = false;
  //   /*
  //    * Set timeout is required to close the animation with animation and override/delay the defaut closing of material dialog.
  //    * If not used, the overlay will not close as per our required animation
  //    * dialogref.close is required to unload the overlay component.
  //   */
  //   setTimeout(function () {
  //     self.dialogRef.close();
  //   }, 1000);
  // }

}

