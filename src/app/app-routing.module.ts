import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/Public/home/home.component';
import { ProducersComponent } from './views/Public/producers/producers.component';
import { VendorsComponent } from './views/Public/vendors/vendors.component';
import { CollectorsComponent } from './views/Public/collectors/collectors.component';
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
import { IsProducerService } from './services/auth/is-producer.service';
import { IsVendorService } from './services/auth/is-vendor.service';
import { IsCollectorService } from './services/auth/is-collector.service';
import { AdminProfileComponent } from './views/Private/admin/admin-profile/admin-profile.component';
import { UserProfileComponent } from './views/Private/producer/producer-profile/user-profile.component';
import { VendorProfileComponent } from './views/Private/vendor/vendor-profile/vendor-profile.component';
import { CollectorProfileComponent } from './views/Private/collector/collector-profile/collector-profile.component';
import { AdminLoginComponent } from './views/Private/admin/admin-login/admin-login.component';
import { AdminComponent } from './views/Private/admin/admin-dashboard/admin.component';
import { EnterprisesComponent } from './views/Public/enterprises/enterprises.component';
import { EnterpriseSignupComponent } from './views/Auth/enterprise-signup/enterprise-signup.component';
import { VendorSignupComponent } from './views/Auth/vendor-signup/vendor-signup.component';
import { CollectorSignupComponent } from './views/Auth/collector-signup/collector-signup.component';
 


const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "home", component: HomeComponent },
  { path: "producers", component: ProducersComponent },
  { path: "individuals", component: ProducersComponent },
  { path: "enterprises", component: EnterprisesComponent },
  { path: "vendors", component: VendorsComponent },
  { path: "collectors", component: CollectorsComponent },
  { path: "listing", component: ListingComponent },
  { path: "contact", component: ContactComponent },
  {
    path: "admin",
    component: AdminLoginComponent,
    canActivate: [BeforeLoginService]
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [BeforeLoginService]
  },
  {
    path: "households/signup",
    component: SignupComponent,
    canActivate: [BeforeLoginService]
  },
  {
    path: "enterprises/signup",
    component: EnterpriseSignupComponent,
    canActivate: [BeforeLoginService]
  },
  {
    path: "vendors/signup",
    component: VendorSignupComponent,
    canActivate: [BeforeLoginService]
  },
  {
    path: "collectors/signup",
    component: CollectorSignupComponent,
    canActivate: [BeforeLoginService]
  },
  {
    path: "dashboard/users",
    component: UsersComponent,
    canActivate: [AfterLoginService, IsAdminService]
  },
  {
    path: "dashboard/messages",
    component: MessagesComponent,
    canActivate: [AfterLoginService, IsAdminService]
  },
  {
    path: "dashboard/users/:id",
    component: SingleUserComponent,
    canActivate: [AfterLoginService, IsAdminService]
  },
  {
    path: "dashboard/admin",
    component: AdminComponent,
    canActivate: [AfterLoginService, IsAdminService]
  },
  {
    path: "dashboard/listedScrap",
    component: ListedScrapComponent,
    canActivate: [AfterLoginService, IsAdminService]
  },
  {
    path: "dashboard/listedScrap/:id",
    component: SingleListedScrapComponent,
    canActivate: [AfterLoginService, IsAdminService]
  },
  {
    path: "admin/profile",
    component: AdminProfileComponent,
    canActivate: [AfterLoginService, IsAdminService]
  },
  {
    path: "producer/profile",
    component: UserProfileComponent,
    canActivate: [AfterLoginService, IsProducerService]
  },
  {
    path: "collector/profile",
    component: CollectorProfileComponent,
    canActivate: [AfterLoginService, IsCollectorService]
  },
  {
    path: "vendor/profile",
    component: VendorProfileComponent,
    canActivate: [AfterLoginService, IsVendorService]
  },
  {
    path: "dashboard/producer",
    component: ProducerDashboardComponent,
    canActivate: [AfterLoginService, IsProducerService]
  },
  {
    path: "dashboard/vendor",
    component: VendorDashboardComponent,
    canActivate: [AfterLoginService, IsVendorService]
  },
  {
    path: "dashboard/collector",
    component: CollectorDashboardComponent,
    canActivate: [AfterLoginService, IsCollectorService]
  },
  {
    path: "request-password-reset",
    component: RequestResetPasswordComponent,
    canActivate: [BeforeLoginService]
  },
  {
    path: "response-password-reset",
    component: ResponseResetPasswordComponent,
    canActivate: [BeforeLoginService]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
