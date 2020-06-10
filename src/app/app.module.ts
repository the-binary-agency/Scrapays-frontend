import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './views/Public/home/home.component';
import { HeaderComponent } from './Constants/header/header.component';
import { FooterComponent } from './Constants/footer/footer.component';
import { ProducersComponent } from './views/Public/producers/producers.component';
import { VendorsComponent } from './views/Public/vendors/vendors.component';
import { CollectorsComponent } from './views/Public/collectors/collectors.component';
import { ListingComponent } from './views/Public/listing/listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './views/Auth/login/login.component';
import { SignupComponent } from './views/Auth/signup/signup.component';
import { DndDirective } from './directives/dnd.directive';
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { NgbModalModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { RequestResetPasswordComponent } from './views/Auth/request-reset-password/request-reset-password.component';
import { ResponseResetPasswordComponent } from './views/Auth/response-reset-password/response-reset-password.component';
import { PageNotFoundComponent } from './views/Public/page-not-found/page-not-found.component';
import { ChartsModule } from 'ng2-charts';
import { UsersComponent } from './views/Private/admin/users/users.component';
import { SingleUserComponent } from './views/Private/admin/single-user/single-user.component';
import { ListedScrapComponent } from './views/Private/admin/listed-scrap/listed-scrap.component';
import { SingleListedScrapComponent } from './views/Private/admin/single-listed-scrap/single-listed-scrap.component';
import { AdminLoginComponent } from './views/Private/admin/admin-login/admin-login.component';
import { ContactComponent } from './views/Public/contact/contact.component';
import { MessagesComponent } from './views/Private/admin/messages/messages.component';
import { ProducerDashboardComponent } from './views/Private/producer/producer-dashboard/producer-dashboard.component';
import { CollectorDashboardComponent } from './views/Private/collector/collector-dashboard/collector-dashboard.component';
import { VendorDashboardComponent } from './views/Private/vendor/vendor-dashboard/vendor-dashboard.component';
import { AdminProfileComponent } from './views/Private/admin/admin-profile/admin-profile.component';
import { UserProfileComponent } from './views/Private/producer/producer-profile/user-profile.component';
import { VendorProfileComponent } from './views/Private/vendor/vendor-profile/vendor-profile.component';
import { CollectorProfileComponent } from './views/Private/collector/collector-profile/collector-profile.component';
import { AdminComponent } from './views/Private/admin/admin-dashboard/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatModule } from './ext-module/mat.module';
import { SidenavComponent } from './Constants/sidenav/sidenav.component';
import { TokenInterceptor } from './services/auth/token.interceptor';
import { EnterprisesComponent } from './views/Public/enterprises/enterprises.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { EnterpriseSignupComponent } from './views/Auth/enterprise-signup/enterprise-signup.component';
import { VendorSignupComponent } from './views/Auth/vendor-signup/vendor-signup.component';
import { CollectorSignupComponent } from './views/Auth/collector-signup/collector-signup.component';

@NgModule( {
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ProducersComponent,
    VendorsComponent,
    CollectorsComponent,
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
    EnterprisesComponent,
    DateAgoPipe,
    EnterpriseSignupComponent,
    VendorSignupComponent,
    CollectorSignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModalModule,
    NgbAlertModule,
    RxReactiveFormsModule,
    ChartsModule,
    NgxLoadingModule.forRoot( {
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBorderRadius: '4px',
      primaryColour: '#FF7900',
      secondaryColour: '#049B41',
    } ),
    BrowserAnimationsModule,
    MatModule,
    ServiceWorkerModule.register( 'ngsw-worker.js', { enabled: environment.production } ),
    LazyLoadImageModule
  ],
  providers: [
    HeaderComponent,
    SidenavComponent,
    LoginComponent,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
