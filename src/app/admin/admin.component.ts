import { Component, OnInit } from '@angular/core';
import { AppInsightsService } from '../app-insights.service';
import { CoreService } from '../core/core.service';
import { ConstantsMaster } from '../shared/constants/constantsMaster';
import { GoogleAnalytics } from '../shared/google-analytics/googleAnalytics';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  constructor(private coreService: CoreService, private appInsightsService: AppInsightsService,) { }
  ngOnInit() {
    GoogleAnalytics.staffingTrackPageView(this.coreService.loggedInUser.employeeCode, ConstantsMaster.appScreens.page.admin, '');
    this.appInsightsService.logPageView(this.coreService.loggedInUser.employeeCode, ConstantsMaster.appScreens.page.admin);
  }
}
