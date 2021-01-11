import { InjectionToken, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
// import { HomeComponent } from './views/Public/home/home.component';
// import { ProducersComponent } from './views/Public/producers/producers.component';
// import { VendorsComponent } from './views/Public/vendors/vendors.component';
// import { CollectorsComponent } from './views/Public/collectors/collectors.component';
import { ListingComponent } from './views/Public/listing/listing.component';
import { LoginComponent } from './views/Auth/login/login.component';
import { SignupComponent } from './views/Auth/signup/signup.component';
import { BeforeLoginService } from './services/auth/before-login.service';
import { RequestResetPasswordComponent } from './views/Auth/request-reset-password/request-reset-password.component';
import { ResponseResetPasswordComponent } from './views/Auth/response-reset-password/response-reset-password.component';
import { AfterLoginService } from './services/auth/after-login.service';
import { PageNotFoundComponent } from './views/Public/page-not-found/page-not-found.component';
import { UsersComponent } from './views/Private/admin/users/users.component';
import { SingleUserComponent } from './views/Private/admin/single-user/single-user.component';
import { IsAdminService } from './services/auth/is-admin.service';
import { ListedScrapComponent } from './views/Private/admin/listed-scrap/listed-scrap.component';
import { SingleListedScrapComponent } from './views/Private/admin/single-listed-scrap/single-listed-scrap.component';
import { ContactComponent } from './views/Public/contact/contact.component';
import { MessagesComponent } from './views/Private/admin/messages/messages.component';
import { ProducerDashboardComponent } from './views/Private/producer/producer-dashboard/producer-dashboard.component';
import { VendorDashboardComponent } from './views/Private/vendor/vendor-dashboard/vendor-dashboard.component';
import { CollectorDashboardComponent } from './views/Private/collector/collector-dashboard/collector-dashboard.component';
import { IsVendorService } from './services/auth/is-vendor.service';
import { IsCollectorService } from './services/auth/is-collector.service';
import { AdminProfileComponent } from './views/Private/admin/admin-profile/admin-profile.component';
import { UserProfileComponent } from './views/Private/producer/producer-profile/user-profile.component';
import { VendorProfileComponent } from './views/Private/vendor/vendor-profile/vendor-profile.component';
import { CollectorProfileComponent } from './views/Private/collector/collector-profile/collector-profile.component';
import { AdminLoginComponent } from './views/Private/admin/admin-login/admin-login.component';
import { AdminComponent } from './views/Private/admin/admin-dashboard/admin.component';
import { EnterpriseSignupComponent } from './views/Auth/enterprise-signup/enterprise-signup.component';
import { VendorSignupComponent } from './views/Auth/vendor-signup/vendor-signup.component';
import { CollectorSignupComponent } from './views/Auth/collector-signup/collector-signup.component';
import { EnterpriseProfileComponent } from './views/Private/enterprise/enterprise-profile/enterprise-profile.component';
import { EnterpriseDashboardComponent } from './views/Private/enterprise/enterprise-dashboard/enterprise-dashboard.component';
import { IsEnterpriseService } from './services/auth/is-enterprise.service';
import { IsHouseholdService } from './services/auth/is-household.service';
import { EditMaterialsComponent } from './views/Private/admin/edit-materials/edit-materials.component';
import { CreateAdminComponent } from './views/Private/admin/create-admin/create-admin.component';
import { TrackCollectorComponent } from './views/Private/admin/track-collector/track-collector.component';
import { CollectMaterialsComponent } from './views/Private/collector/collect-materials/collect-materials.component';
import { HouseholdsComponent } from './views/Private/admin/households/households.component';
import { CollectorsComponent } from './views/Private/admin/collectors/collectors.component';
import { VendorsComponent } from './views/Private/admin/vendors/vendors.component';
import { SingleHouseholdComponent } from './views/Private/admin/single-household/single-household.component';
import { SingleCollectorComponent } from './views/Private/admin/single-collector/single-collector.component';
import { SingleHostComponent } from './views/Private/admin/single-host/single-host.component';
import { PickupRequestsComponent } from './views/Private/admin/pickup-requests/pickup-requests.component';
import { AssignedPickupsComponent } from './views/Private/collector/assigned-pickups/assigned-pickups.component';
import { NewPickupsComponent } from './views/Private/admin/new-pickups/new-pickups.component';
import { BluetoothComponent } from './views/Public/bluetooth/bluetooth.component';
import { AdminsComponent } from './views/Private/admin/admins/admins.component';
import { SingleAdminComponent } from './views/Private/admin/single-admin/single-admin.component';
import { SetUserPasswordComponent } from './views/Private/admin/set-user-password/set-user-password.component';

const externalUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    resolve: { url: externalUrlProvider },
    data: {
      externalUrl: 'https://www.scrapays.com',
    },
    component: PageNotFoundComponent,
  },
  { path: 'listing', component: ListingComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'bluetooth', component: BluetoothComponent },
  {
    path: 'admin',
    component: AdminLoginComponent,
    canActivate: [BeforeLoginService],
  },
  {
    path: 'dashboard/enterprises',
    component: UsersComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/households',
    component: HouseholdsComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/collectors',
    component: CollectorsComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/hosts',
    component: VendorsComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/messages',
    component: MessagesComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/edit-materials',
    component: EditMaterialsComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/create-admin',
    component: CreateAdminComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/set-user-pin',
    component: SetUserPasswordComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/track-collector',
    component: TrackCollectorComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/enterprise/:id',
    component: SingleUserComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/household/:id',
    component: SingleHouseholdComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/collector/:id',
    component: SingleCollectorComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/host/:id',
    component: SingleHostComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/admin',
    component: AdminComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/admins',
    component: AdminsComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/admins/:id',
    component: SingleAdminComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/pickup-requests',
    component: PickupRequestsComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/new-pickups',
    component: NewPickupsComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/new-pickups/:params',
    component: NewPickupsComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/listedScrap',
    component: ListedScrapComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'dashboard/listedScrap/:id',
    component: SingleListedScrapComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },
  {
    path: 'admin/profile',
    component: AdminProfileComponent,
    canActivate: [AfterLoginService, IsAdminService],
  },

  {
    path: 'login/enterprise',
    component: LoginComponent,
    canActivate: [BeforeLoginService],
  },
  {
    path: 'login/household',
    component: LoginComponent,
    canActivate: [BeforeLoginService],
  },
  {
    path: 'login/partners',
    component: LoginComponent,
    canActivate: [BeforeLoginService],
  },
  {
    path: 'household/signup',
    component: SignupComponent,
    canActivate: [BeforeLoginService],
  },
  {
    path: 'enterprise/signup',
    component: EnterpriseSignupComponent,
    canActivate: [BeforeLoginService],
  },
  {
    path: 'host/signup',
    component: VendorSignupComponent,
    canActivate: [BeforeLoginService],
  },
  {
    path: 'collector/signup',
    component: CollectorSignupComponent,
    canActivate: [BeforeLoginService],
  },

  {
    path: 'household/profile',
    component: UserProfileComponent,
    canActivate: [AfterLoginService, IsHouseholdService],
  },
  {
    path: 'dashboard/household',
    component: ProducerDashboardComponent,
    canActivate: [AfterLoginService, IsHouseholdService],
  },

  {
    path: 'collector/profile',
    component: CollectorProfileComponent,
    canActivate: [AfterLoginService, IsCollectorService],
  },
  {
    path: 'dashboard/collector',
    component: CollectorDashboardComponent,
    canActivate: [AfterLoginService, IsCollectorService],
  },
  {
    path: 'collector/dashboard/collect-materials',
    component: CollectMaterialsComponent,
    canActivate: [AfterLoginService, IsCollectorService],
  },
  {
    path: 'collector/dashboard/assigned-pickups',
    component: AssignedPickupsComponent,
    canActivate: [AfterLoginService, IsCollectorService],
  },

  {
    path: 'host/profile',
    component: VendorProfileComponent,
    canActivate: [AfterLoginService, IsVendorService],
  },
  {
    path: 'dashboard/host',
    component: VendorDashboardComponent,
    canActivate: [AfterLoginService, IsVendorService],
  },

  {
    path: 'enterprise/profile',
    component: EnterpriseProfileComponent,
    canActivate: [AfterLoginService, IsEnterpriseService],
  },
  {
    path: 'dashboard/enterprise',
    component: EnterpriseDashboardComponent,
    canActivate: [AfterLoginService, IsEnterpriseService],
  },

  {
    path: 'request-password-reset',
    component: RequestResetPasswordComponent,
    canActivate: [BeforeLoginService],
  },
  {
    path: 'response-password-reset',
    component: ResponseResetPasswordComponent,
    canActivate: [BeforeLoginService],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  providers: [
    {
      provide: externalUrlProvider,
      useValue: (route: ActivatedRouteSnapshot) => {
        window.location.href = (route.data as any).externalUrl;
      },
    },
  ],
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
