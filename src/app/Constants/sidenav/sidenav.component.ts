import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SideMenuService } from 'src/app/services/general/side-menu.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDataService } from 'src/app/services/auth/user-data.service';
import { EnvironmentService } from 'src/app/services/env/environment.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  @ViewChild('content') private content;
  @ViewChild('notificationsModal') private notificationsModal;

  public loggedIn: boolean;
  public Admin: boolean;
  public Household: boolean;
  public Enterprise: boolean;
  public Host: boolean;
  public Collector: boolean;
  modalTitle: any;
  modalBody: any;
  loading = false;
  viewNotification = false;
  notificationToBeViewed: any = {};

  constructor(
    private sideNavService: SideMenuService,
    private router: Router,
    private Auth: AuthService,
    private Token: TokenService,
    private modal: NgbModal,
    private userData: UserDataService,
    private token: TokenService,
    private auth: AuthService,
    private env: EnvironmentService
  ) {}

  avatar = 'assets/images/icons/user-icon.png';
  URL = this.env.assetUrl;
  screenWidth: number;
  lastHome: string;
  User: any = { userable: {} };
  newNotificationsToShow = [];
  readNotificationsToShow = [];
  newNotifications = [];
  readNotifications = [];
  tempNotifications = [];
  openedNotifications = [];
  notyLoading = false;

  ngOnInit(): void {
    this.processRoles();
    this.changeSidenavMode();
    this.getUser();
  }

  ngAfterViewInit(): void {
    this.sideNavService.sideNavToggleSubject.subscribe(() => {
      this.sidenav.toggle();
    });
    if (this.screenWidth > 768 && this.loggedIn) {
      if (this.checkRoute()) {
        this.sidenav.open();
      }
    } else {
      this.sidenav.close();
    }
  }

  changeSidenavMode() {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };
  }

  processRoles() {
    this.Auth.authStatus.subscribe((value) => (this.loggedIn = value));
    this.Auth.adminStatus.subscribe((value) => (this.Admin = value));
    this.Auth.householdStatus.subscribe((value) => (this.Household = value));
    this.Auth.enterpriseStatus.subscribe((value) => (this.Enterprise = value));
    this.Auth.collectorStatus.subscribe((value) => (this.Collector = value));
    this.Auth.HostStatus.subscribe((value) => (this.Host = value));
    this.userData.User.subscribe((value) => (this.User = value));
  }

  logOut(event: MouseEvent) {
    event.preventDefault();
    var Admin = this.Admin;
    var Household = this.Household;
    var Enterprise = this.Enterprise;
    var Host = this.Host;
    var Collector = this.Collector;
    this.Token.remove();
    this.Auth.changeAuthStatus(false);
    this.Auth.changeAdminStatus(false);
    this.Auth.changeHouseholdStatus(false);
    this.Auth.changeEnterpriseStatus(false);
    this.Auth.changeHostStatus(false);
    this.Auth.changeCollectorStatus(false);
    this.sidenav.close();
    if (Admin) {
      this.router.navigateByUrl('/login/enterprise');
    } else if (Enterprise) {
      this.router.navigateByUrl('/login/enterprise');
    } else if (Household) {
      this.router.navigateByUrl('/login/household');
    } else if (Host) {
      this.router.navigateByUrl('/login/partners');
    } else if (Collector) {
      this.router.navigateByUrl('/login/partners');
    }
  }

  signOut() {
    var Admin = this.Admin;
    var Household = this.Household;
    var Enterprise = this.Enterprise;
    var Host = this.Host;
    var Collector = this.Collector;
    this.Token.remove();
    this.Auth.changeAuthStatus(false);
    this.Auth.changeAdminStatus(false);
    this.Auth.changeHouseholdStatus(false);
    this.Auth.changeEnterpriseStatus(false);
    this.Auth.changeHostStatus(false);
    this.Auth.changeCollectorStatus(false);
    if (Admin || Collector || Host) {
      this.router.navigateByUrl('/login/partners');
    } else if (Enterprise) {
      this.router.navigateByUrl('/login/enterprise');
    } else if (Household) {
      this.router.navigateByUrl('/login/household');
    }
    this.sidenav.close();
  }

  clickMenu(event: MouseEvent) {
    event.preventDefault();
    this.sidenav.toggle();
  }

  getRoute() {
    var route = this.router.url;
    return route.split('/')[1];
  }

  checkRoute() {
    if (this.getRoute() == 'listing' || this.getRoute() == 'contact') {
      return false;
    }
    return true;
  }

  success(message) {
    this.loading = false;
    this.modalTitle = 'Success';
    this.modalBody = message;
  }

  error(error) {
    this.loading = false;
    this.modalTitle = 'Error';
    this.modalBody = error;
  }

  openModal(content) {
    this.modal.open(content, { centered: true });
  }

  test() {
    console.log('sdfghjkl;lkj');
  }

  getUser() {
    if (this.token._id) {
      this.auth.getLoggedInUser().subscribe((res: any) => {
        this.userData.updateUserData(res.data);
        this.getNotifications();
      });
    }
  }

  getNotifications() {
    this.auth.getUserWithNotifications(this.token._id).subscribe((res: any) => {
      this.handleNotifications(res.data);
    });
  }

  handleNotifications(notifications) {
    this.newNotifications = [];
    this.readNotifications = [];
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].read == false) {
        this.newNotifications.push(notifications[i]);
      } else {
        this.readNotifications.push(notifications[i]);
      }
    }
    this.newNotificationsToShow = this.newNotifications;
    this.readNotificationsToShow = this.readNotifications;
    console.log(this.newNotificationsToShow);
  }

  closeNotificationModal() {
    this.notificationsModal.nativeElement.style.display = 'none';
  }

  onNewPageChange($event) {
    this.newNotificationsToShow = this.newNotifications.slice(
      $event.pageIndex * $event.pageSize,
      $event.pageIndex * $event.pageSize + $event.pageSize
    );
  }

  onReadPageChange($event) {
    this.readNotificationsToShow = this.readNotifications.slice(
      $event.pageIndex * $event.pageSize,
      $event.pageIndex * $event.pageSize + $event.pageSize
    );
  }

  showNotification(notification) {
    this.viewNotification = true;
    this.tempNotifications.push(notification);
    this.toggleSelected(false);
    this.notificationToBeViewed = notification.notification_body;
    if (this.tempNotifications.indexOf(notification) == -1) {
      this.openedNotifications.push(notification);
      this.auth
        .toggleNotifications({ notifications: this.openedNotifications })
        .subscribe();
    }
    this.getUser();
  }

  cancelShow() {
    this.viewNotification = false;
  }

  checkValue(event, i) {
    if (event.currentTarget.checked == true) {
      this.tempNotifications.push(this.newNotifications[i]);
    } else {
      for (let ind = 0; ind < this.tempNotifications.length; ind++) {
        if (this.newNotifications[i].id == this.tempNotifications[ind].id) {
          this.tempNotifications.splice(ind, 1);
        }
      }
    }
  }

  checkReadValue(event, i) {
    if (event.currentTarget.checked == true) {
      this.tempNotifications.push(this.readNotifications[i]);
    } else {
      for (let ind = 0; ind < this.tempNotifications.length; ind++) {
        if (this.readNotifications[i].id == this.tempNotifications[ind].id) {
          this.tempNotifications.splice(ind, 1);
        }
      }
    }
  }

  deleteSelected() {
    this.notyLoading = true;
    this.auth
      .deleteNotifications({ notifications: this.tempNotifications })
      .subscribe((data) => {
        this.notyLoading = false;
        this.tempNotifications = [];
        this.getUser();
      });
  }

  toggleSelected(load: boolean) {
    if (load == true) {
      this.notyLoading = true;
    }
    this.auth
      .toggleNotifications({ notifications: this.tempNotifications })
      .subscribe(
        (data) => {
          this.notyLoading = false;
          this.tempNotifications = [];
          this.getUser();
        },
        (error) => console.log(error)
      );
  }
}
