import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// import { HomeComponent } from './views/Public/home/home.component';
// import { ProducersComponent } from './views/Public/producers/producers.component';
// import { VendorsComponent } from './views/Public/vendors/vendors.component';
// import { CollectorsComponent } from './views/Public/collectors/collectors.component';
// import { EnterprisesComponent } from './views/Public/enterprises/enterprises.component';
import { HeaderComponent } from "./Constants/header/header.component";
import { FooterComponent } from "./Constants/footer/footer.component";
import { ListingComponent } from "./views/Public/listing/listing.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./views/Auth/login/login.component";
import { SignupComponent } from "./views/Auth/signup/signup.component";
import { DndDirective } from "./directives/dnd.directive";
import {
  NgbModalModule,
  NgbAlertModule,
  NgbPopoverModule,
  NgbPopoverConfig,
  NgbDatepickerModule,
  NgbInputDatepickerConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { RequestResetPasswordComponent } from "./views/Auth/request-reset-password/request-reset-password.component";
import { ResponseResetPasswordComponent } from "./views/Auth/response-reset-password/response-reset-password.component";
import { PageNotFoundComponent } from "./views/Public/page-not-found/page-not-found.component";
import { ChartsModule } from "ng2-charts";
import { UsersComponent } from "./views/Private/admin/users/users.component";
import { SingleUserComponent } from "./views/Private/admin/single-user/single-user.component";
import { ListedScrapComponent } from "./views/Private/admin/listed-scrap/listed-scrap.component";
import { SingleListedScrapComponent } from "./views/Private/admin/single-listed-scrap/single-listed-scrap.component";
import { AdminLoginComponent } from "./views/Private/admin/admin-login/admin-login.component";
import { ContactComponent } from "./views/Public/contact/contact.component";
import { MessagesComponent } from "./views/Private/admin/messages/messages.component";
import { ProducerDashboardComponent } from "./views/Private/producer/producer-dashboard/producer-dashboard.component";
import { CollectorDashboardComponent } from "./views/Private/collector/collector-dashboard/collector-dashboard.component";
import { VendorDashboardComponent } from "./views/Private/vendor/vendor-dashboard/vendor-dashboard.component";
import { AdminProfileComponent } from "./views/Private/admin/admin-profile/admin-profile.component";
import { UserProfileComponent } from "./views/Private/producer/producer-profile/user-profile.component";
import { VendorProfileComponent } from "./views/Private/vendor/vendor-profile/vendor-profile.component";
import { CollectorProfileComponent } from "./views/Private/collector/collector-profile/collector-profile.component";
import { AdminComponent } from "./views/Private/admin/admin-dashboard/admin.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatModule } from "./ext-module/mat.module";
import { SidenavComponent } from "./Constants/sidenav/sidenav.component";
import { TokenInterceptor } from "./services/auth/token.interceptor";
import { DateAgoPipe } from "./pipes/date-ago.pipe";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { EnterpriseSignupComponent } from "./views/Auth/enterprise-signup/enterprise-signup.component";
import { VendorSignupComponent } from "./views/Auth/vendor-signup/vendor-signup.component";
import { CollectorSignupComponent } from "./views/Auth/collector-signup/collector-signup.component";
import { EnterpriseDashboardComponent } from "./views/Private/enterprise/enterprise-dashboard/enterprise-dashboard.component";
import { EnterpriseProfileComponent } from "./views/Private/enterprise/enterprise-profile/enterprise-profile.component";
import { EditMaterialsComponent } from "./views/Private/admin/edit-materials/edit-materials.component";
import { CreateAdminComponent } from "./views/Private/admin/create-admin/create-admin.component";
import { TrackCollectorComponent } from "./views/Private/admin/track-collector/track-collector.component";
import { CollectMaterialsComponent } from './views/Private/collector/collect-materials/collect-materials.component';
import { HouseholdsComponent } from './views/Private/admin/households/households.component';
import { CollectorsComponent } from './views/Private/admin/collectors/collectors.component';
import { VendorsComponent } from './views/Private/admin/vendors/vendors.component';
import { SingleHouseholdComponent } from './views/Private/admin/single-household/single-household.component';
import { SingleCollectorComponent } from './views/Private/admin/single-collector/single-collector.component';
import { SingleHostComponent } from './views/Private/admin/single-host/single-host.component';
import { PickupRequestsComponent } from './views/Private/admin/pickup-requests/pickup-requests.component';

@NgModule({
  declarations: [
    AppComponent,
    // HomeComponent,
    // ProducersComponent,
    // VendorsComponent,
    // CollectorsComponent,
    // EnterprisesComponent,
    HeaderComponent,
    FooterComponent,
    ListingComponent,
    LoginComponent,
    SignupComponent,
    DndDirective,
    RequestResetPasswordComponent,
    ResponseResetPasswordComponent,
    PageNotFoundComponent,
    UsersComponent,
    SingleUserComponent,
    ListedScrapComponent,
    SingleListedScrapComponent,
    AdminLoginComponent,
    ContactComponent,
    MessagesComponent,
    ProducerDashboardComponent,
    CollectorDashboardComponent,
    VendorDashboardComponent,
    AdminProfileComponent,
    UserProfileComponent,
    VendorProfileComponent,
    CollectorProfileComponent,
    AdminComponent,
    SidenavComponent,
    DateAgoPipe,
    EnterpriseSignupComponent,
    VendorSignupComponent,
    CollectorSignupComponent,
    EnterpriseDashboardComponent,
    EnterpriseProfileComponent,
    EditMaterialsComponent,
    CreateAdminComponent,
    TrackCollectorComponent,
    CollectMaterialsComponent,
    HouseholdsComponent,
    CollectorsComponent,
    VendorsComponent,
    SingleHouseholdComponent,
    SingleCollectorComponent,
    SingleHostComponent,
    PickupRequestsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModalModule,
    NgbAlertModule,
    NgbPopoverModule,
    NgbDatepickerModule,
    ChartsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBorderRadius: "4px",
      primaryColour: "#FF7900",
      secondaryColour: "#049B41",
    }),
    BrowserAnimationsModule,
    MatModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    // NgxDatePickerModule
  ],
  providers: [
    HeaderComponent,
    SidenavComponent,
    LoginComponent,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    NgbPopoverConfig,
    NgbInputDatepickerConfig,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
