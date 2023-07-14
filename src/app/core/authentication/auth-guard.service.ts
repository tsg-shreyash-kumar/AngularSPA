import { Injectable } from '@angular/core';
import { Router, CanLoad, Route, UrlSegment, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { ConstantsMaster } from 'src/app/shared/constants/constantsMaster';
import { CoreService } from '../core.service';
import { AadAuthenticationService } from './aad-authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanLoad {

  constructor(private router: Router, private coreService: CoreService, private msalService :MsalService, private aadAuthService: AadAuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      // this.aadAuthService.redirectUrl = state.url;
      // if(this.msalService.instance.getActiveAccount()!=null)
      // {
      //   return true;
      // }
      // else
      // {
      //   return false;
      // }
      return true;
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const url: string = route.path;
    let queryParams = new URLSearchParams(this.router.getCurrentNavigation().extractedUrl.queryParams)?.toString();
    
    this.coreService.routeUrl = !queryParams ? `/${segments[0].path}` : `/${segments[0].path}?${queryParams}`;

    if (this.isSiteUnderMaintainance()) {
      this.router.navigate(['./offline'], { queryParams: { returnUrl: url } });
      return false;
    }

    if (this.isUserDetailsLoad()) {
      return false;
    }
    return this.redirectUserToAccessiblePage(url);
  }

  private isUserDetailsLoad() {
    return !this.coreService.loggedInUser;
  }

  private hasAccessToRequestedPage(url: string) {
    var accessibleFeatures = this.coreService.loggedInUserClaims?.FeatureAccess.map(x => x.FeatureName);
    var haveAccessToPage = this.getPageAccess(url, accessibleFeatures);
    return haveAccessToPage;
  }

  private getPageAccess(url, accessiblePages) {
    if (!accessiblePages) return false;
    switch (true) {
      case ConstantsMaster.regexUrl.overlay.test(url):
        return accessiblePages.some(x => x === ConstantsMaster.appScreens.page.overlay);
      case ConstantsMaster.regexUrl.analytics.test(url):
        return accessiblePages.some(x => x.includes(ConstantsMaster.appScreens.page.analytics));
      case ConstantsMaster.regexUrl.admin.test(url):
        return accessiblePages.some(x => x === ConstantsMaster.appScreens.page.admin);
      case ConstantsMaster.regexUrl.home.test(url):
        return accessiblePages.some(x => x === ConstantsMaster.appScreens.page.home);
      case ConstantsMaster.regexUrl.resources.test(url):
        return accessiblePages.some(x => x === ConstantsMaster.appScreens.page.resources);
      case ConstantsMaster.regexUrl.casePlanning.test(url):
        return accessiblePages.some(x => x === ConstantsMaster.appScreens.page.casePlanning);
      default:
        return false;
    }

  }

  private isSiteUnderMaintainance() {
    //To-Do : Move employee codes to environment.json file
    var employee = [ '57079','60074', '37995', '39209', '58749', '63049', '45088'];
    if (this.coreService.appSettings?.siteUnderMaintainance === 'true' && !employee.includes(this.coreService.loggedInUser?.employeeCode)) 
      return true; 
    else
     return false;
  }

  private isAuthenticated() {
    return this.coreService.loggedInUser?.token != null && this.coreService.loggedInUser?.token !== '';
  }

  private redirectUserToAccessiblePage(url: string) {
    if (!this.isAuthenticated) {
      return this.unauthorizedAccess('application');
    }

    if (this.hasAccessToRequestedPage(url)) {
      return true;
    }

    return this.unauthorizedAccess('page')
  }

  private unauthorizedAccess(accessType) {
    this.router.navigate(['./accessdenied'], { queryParams: { accessType: accessType } });
    return false;
  }
}

