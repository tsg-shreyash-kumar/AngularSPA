import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment'
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpConfigInterceptor } from './core/interceptor/httpconfig.interceptor';
// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './in-memory-data.service';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LicenseManager } from 'ag-grid-enterprise';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalRedirectComponent, MsalService, MSAL_GUARD_CONFIG, MSAL_INSTANCE } from '@azure/msal-angular';
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AadAuthenticationService } from './core/authentication/aad-authentication.service';
// tslint:disable-next-line: max-line-length
LicenseManager.setLicenseKey('CompanyName=Bain & Company, Inc.,LicensedGroup=TSG_Software_Agile,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=18,LicensedProductionInstancesCount=0,AssetReference=AG-029359,SupportServicesEnd=28_July_2023_[v2]_MTY5MDQ5ODgwMDAwMA==bd0970d673271bdb9939279bbf731376');

// export function intializeApp(appInializerService: AppInitializerService): Function {
//   return () => appInializerService.initializeApp();
// }

export function MSALInstanceFactory(aadAuthService: AadAuthenticationService): IPublicClientApplication {
  // return aadAuthService.getMSALInstanceFactory();
  return new PublicClientApplication({
    auth: {
      clientId: environment.azureActiveDirectorySettings.clientId,
      authority: `https://login.microsoftonline.com/${environment.azureActiveDirectorySettings.tenantId}`,
      redirectUri: environment.azureActiveDirectorySettings.redirectUri
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: this.isIE, 
    }
  });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    /**
     * TODO : Comment before check-in
     * Intercepts HttpClient request and redirects them to InmemoryDataService
     */
    //  HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, { passThruUnknownUrl: true }),
    AppRoutingModule,
    ToastrModule.forRoot(), // ToastrModule added
    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      },
    }),
    EffectsModule.forRoot([]),
    ServiceWorkerModule.register('ngsw-worker.js',{
      enabled: environment.production
    }), 
    NgbModule
    // for debugging purposes only
    // StoreDevtoolsModule.instrument(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
      deps: [AadAuthenticationService]
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    MsalGuard,
    MsalService,
    MsalBroadcastService ,
    LicenseManager
    // HttpCancelService,
    // { provide: HTTP_INTERCEPTORS, useClass: ManageHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
