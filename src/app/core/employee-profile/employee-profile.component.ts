import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Employee } from '../../shared/interfaces/employee.interface';
import { ProfileImageService } from 'src/app/shared/services/profileImage.service';
import { CoreService } from '../core.service';
import { CommonService } from 'src/app/shared/commonService';
import { ConstantsMaster } from 'src/app/shared/constants/constantsMaster';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
  providers: [ProfileImageService]
})
export class EmployeeProfileComponent implements OnInit {
  @Input() employee: Employee;
  @Output() openSupplySettingsPopover = new EventEmitter<any>();
  @Output() openOfficeClosurePopover = new EventEmitter<any>();
  disableUserProfile = false;
  appScreens: any;

  constructor(private profileImageService: ProfileImageService,
    private coreService: CoreService) { }

  ngOnInit() {
    this.appScreens = ConstantsMaster.appScreens;
    this.disableUserProfile = !CommonService.hasAccessToFeature(this.appScreens.feature.staffingSettings, this.coreService.loggedInUserClaims?.FeatureAccess.map(x => x.FeatureName));
  }

  getImageUrl() {
    // TODO: Tempory fix. use correct logic in a shared service to get another if actual image does not load
    this.profileImageService.getImage(this.employee.profileImageUrl);
    this.profileImageService.imgUrl.subscribe(imgUrl => this.employee.profileImageUrl = imgUrl);
  }

  openSupplySettingsForm() {
    this.openSupplySettingsPopover.emit();
  }

  openOfficeClosureForm(){
    this.openOfficeClosurePopover.emit();
  }

}
