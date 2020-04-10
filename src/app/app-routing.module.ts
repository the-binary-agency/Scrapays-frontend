import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ProducersComponent } from './views/producers/producers.component';
import { VendorsComponent } from './views/vendors/vendors.component';
import { CollectorsComponent } from './views/collectors/collectors.component';
import { ListingComponent } from './views/listing/listing.component';
import { LoginComponent } from './views/login/login.component';
import { SignupComponent } from './views/signup/signup.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { BeforeLoginService } from './services/before-login.service';
import { RequestResetPasswordComponent } from './views/request-reset-password/request-reset-password.component';
import { ResponseResetPasswordComponent } from './views/response-reset-password/response-reset-password.component';
import { AfterLoginService } from './services/after-login.service';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { UsersComponent } from './views/dashboard/users/users.component';
import { SingleUserComponent } from './views/dashboard/single-user/single-user.component';
import { IsAdminService } from './services/is-admin.service';
import { ListedScrapComponent } from './views/dashboard/listed-scrap/listed-scrap.component';
import { SingleListedScrapComponent } from './views/dashboard/single-listed-scrap/single-listed-scrap.component';
import { AdminLoginComponent } from './views/dashboard/admin-login/admin-login.component';
import { ContactComponent } from './views/contact/contact.component';
import { MessagesComponent } from './views/dashboard/messages/messages.component';
import { ProducerDashboardComponent } from './views/dashboard/producer/producer-dashboard/producer-dashboard.component';
import { VendorDashboardComponent } from './views/dashboard/vendor/vendor-dashboard/vendor-dashboard.component';
import { CollectorDashboardComponent } from './views/dashboard/collector/collector-dashboard/collector-dashboard.component';
import { IsProducerService } from './services/is-producer.service';
import { IsVendorService } from './services/is-vendor.service';
import { IsCollectorService } from './services/is-collector.service';
import { AdminProfileComponent } from './views/profile/admin-profile/admin-profile.component';
import { UserProfileComponent } from './views/profile/user-profile/user-profile.component';
import { NotAdminService } from './services/not-admin.service';
import { VendorProfileComponent } from './views/profile/vendor-profile/vendor-profile.component';
import { CollectorProfileComponent } from './views/profile/collector-profile/collector-profile.component';
 


const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "home", component: HomeComponent },
  { path: "producers", component: ProducersComponent },
  { path: "producers/:segment", component: ProducersComponent },
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
    path: "signup",
    component: SignupComponent,
    canActivate: [BeforeLoginService]
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AfterLoginService]
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
