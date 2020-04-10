import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './views/home/home.component';
import { HeaderComponent } from './views/header/header.component';
import { FooterComponent } from './views/footer/footer.component';
import { ProducersComponent } from './views/producers/producers.component';
import { VendorsComponent } from './views/vendors/vendors.component';
import { CollectorsComponent } from './views/collectors/collectors.component';
import { ListingComponent } from './views/listing/listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './views/login/login.component';
import { SignupComponent } from './views/signup/signup.component';
import { DndDirective } from './directives/dnd.directive';
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './tools/modal/modal.component';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { RequestResetPasswordComponent } from './views/request-reset-password/request-reset-password.component';
import { ResponseResetPasswordComponent } from './views/response-reset-password/response-reset-password.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { ChartsModule } from 'ng2-charts';
import { SideNavComponent } from './views/side-nav/side-nav.component';
import { UsersComponent } from './views/dashboard/users/users.component';
import { SingleUserComponent } from './views/dashboard/single-user/single-user.component';
import { ListedScrapComponent } from './views/dashboard/listed-scrap/listed-scrap.component';
import { SingleListedScrapComponent } from './views/dashboard/single-listed-scrap/single-listed-scrap.component';
import { AdminLoginComponent } from './views/dashboard/admin-login/admin-login.component';
import { ContactComponent } from './views/contact/contact.component';
import { MessagesComponent } from './views/dashboard/messages/messages.component';
import { ProducerDashboardComponent } from './views/dashboard/producer/producer-dashboard/producer-dashboard.component';
import { CollectorDashboardComponent } from './views/dashboard/collector/collector-dashboard/collector-dashboard.component';
import { VendorDashboardComponent } from './views/dashboard/vendor/vendor-dashboard/vendor-dashboard.component';
import { AdminProfileComponent } from './views/profile/admin-profile/admin-profile.component';
import { UserProfileComponent } from './views/profile/user-profile/user-profile.component';
import { VendorProfileComponent } from './views/profile/vendor-profile/vendor-profile.component';
import { CollectorProfileComponent } from './views/profile/collector-profile/collector-profile.component';

@NgModule({
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
    ModalComponent,
    DashboardComponent,
    RequestResetPasswordComponent,
    ResponseResetPasswordComponent,
    PageNotFoundComponent,
    SideNavComponent,
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
    CollectorProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    RxReactiveFormsModule,
    ChartsModule,
    NgxLoadingModule.forRoot( {
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBorderRadius: '4px',
      primaryColour: '#FF7900', 
      secondaryColour: '#049B41',              
    })
  ],
  providers: [ModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
