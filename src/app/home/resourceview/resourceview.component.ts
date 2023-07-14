import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ProfileImageService } from 'src/app/shared/services/profileImage.service';
import { Resource } from '../../shared/interfaces/resource.interface';

@Component({
  selector: 'app-resourceview',
  templateUrl: './resourceview.component.html',
  styleUrls: ['./resourceview.component.scss'],
  providers: [ProfileImageService]
})
export class ResourceviewComponent implements OnInit, OnDestroy {
  showAlertDetails: boolean = false;
  //-----------------------Input Variables--------------------------------------------//

  @Input() resource: Resource;

  //-----------------------Output Events--------------------------------------------//

  @Output() openResourceDetailsDialog = new EventEmitter();
  @Output() resourceSelectedEmitter = new EventEmitter();

  constructor(private profileImageService: ProfileImageService) { }

  //-----------------------Component LifeCycle Events and Functions--------------------------------------------//

  ngOnInit() { }

  resourceClickHandler(event) {
    if (event.ctrlKey) {
      this.resource.isSelected = !this.resource.isSelected;
      this.resourceSelectedEmitter.emit(this.resource);
    }
  }

  isAlertForStaffableAs(alert) {
    return alert.indexOf('Staffable as') > -1;
  }

  //-------------------Component Event Handlers-------------------------------------//

  openResourceDetailsDialogHandler(employeeCode) {
    this.openResourceDetailsDialog.emit(employeeCode);
  }

  toggleAlertDetails() {
    this.showAlertDetails = !this.showAlertDetails;
  }

  hideAlertDetails() {
    this.showAlertDetails = false;
  }

  getImageUrl() {
    this.profileImageService.getImage(this.resource.profileImageUrl);
    this.profileImageService.imgUrl.subscribe(imgUrl => {
      this.resource.profileImageUrl = imgUrl;
    });
  }

  ngOnDestroy(){
    this.profileImageService.imgUrl?.unsubscribe();
  }

}
