import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadingStrategy, PreloadAllModules } from '@angular/router';
import { AuthGuardService as AuthGuard } from './core/authentication/auth-guard.service';
import { AccessDeniedComponent } from './core/access-denied/access-denied.component';
import { SiteMaintainanceComponent } from './core/site-maintainance/site-maintainance.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canLoad: [AuthGuard] },
  { path: 'casePlanning', loadChildren: () => import('./case-planning/case-planning.module').then(m => m.CasePlanningModule),canLoad: [AuthGuard] },
  { path: 'resources', loadChildren: () => import('./resources/resources.module').then(m => m.ResourcesModule), canLoad: [AuthGuard] },
  { path: 'analytics', loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule), canLoad: [AuthGuard] },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canLoad: [AuthGuard] },
  { path: 'overlay', loadChildren: () => import('./overlay/overlay.module').then(m => m.OverlayModule),canLoad: [AuthGuard] },
  { path: 'accessdenied', component: AccessDeniedComponent },
  { path: 'offline', component: SiteMaintainanceComponent },
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
