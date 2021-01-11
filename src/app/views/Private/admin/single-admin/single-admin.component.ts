import { Component, OnInit, ViewChild } from '@angular/core';
import { NavService } from 'src/app/services/general/nav.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnvironmentService } from 'src/app/services/env/environment.service';

@Component({
  selector: 'app-single-admin',
  templateUrl: './single-admin.component.html',
  styleUrls: ['./single-admin.component.css'],
})
export class SingleAdminComponent implements OnInit {
  @ViewChild('content') private content;

  constructor(
    private nav: NavService,
    private auth: AuthService,
    private router: Router,
    private modal: NgbModal,
    private env: EnvironmentService
  ) {}

  ngOnInit(): void {
    this.getLoggedInAdmin();
    this.populateUser();
  }

  Admin: any = { phone: '', userable: {} };
  Balance: any = '0.00';
  loading = false;
  URL = this.env.assetUrl;
  permissionsCheckboxes = [
    'can_view_users',
    'can_update_materials',
    'can_view_revenue',
    'can_give_access_to_collector',
    'can_map_agent',
    'can_give_access_to_agent',
    'can_view_listing',
    'can_view_messages',
    'can_view_producers',
    'all',
  ];
  permissions = [];
  newPermissions = [];
  edit = false;
  modalTitle: any;
  modalBody: any;
  loggedInAdmin: any = { userable: {} };
  isPermitted = false;

  populateUser() {
    if (this.nav.get() == null) {
      var id = this.router.url.split('_')[1];
      this.getSingleUser(id);
    } else {
      var id = this.router.url.split('_')[1];
      this.Admin = this.nav.get();
      this.getWalletBalance(this.Admin.id);
      this.sortPermissions();
    }
  }

  getSingleUser(id) {
    this.auth.getUserWithID(id).subscribe(
      (res: any) => {
        this.Admin = res.data;
        this.getWalletBalance(this.Admin.id);
        this.sortPermissions();
      },
      (error) => console.log(error)
    );
  }

  getLoggedInAdmin() {
    this.auth.getLoggedInUser().subscribe(
      (res: any) => {
        this.loggedInAdmin = res.data;
        let loggedInAdminPermissions = JSON.parse(
          this.loggedInAdmin.userable.permissions
        );
        if (loggedInAdminPermissions.includes('all')) {
          this.isPermitted = true;
        }
      },
      (error) => console.log(error)
    );
  }

  getWalletBalance(id) {
    this.auth.getwalletbalance(id).subscribe(
      (res: any) => (this.Balance = res.data.balance),
      (err) => console.log(err)
    );
  }

  sortPermissions() {
    this.permissions = [];
    let permissions = this.Admin.userable.permissions
      ? JSON.parse(this.Admin.userable.permissions)
      : [];

    this.permissionsCheckboxes.map((permission) => {
      if (permissions.includes(permission)) {
        let perm = { permission, checked: true };
        this.permissions.push(perm);
        this.newPermissions.push(permission);
      } else {
        let perm = {
          permission,
          checked: false,
        };
        this.permissions.push(perm);
      }
    });
  }

  cancelChangePermissions() {
    this.edit = false;
    this.sortPermissions();
  }

  permissionChecked(event, permission) {
    if (event.checked) {
      this.newPermissions.push(permission);
    } else {
      this.removeAt(this.newPermissions, permission);
    }
  }

  splitString(string: String) {
    return string.replace(/_/g, ' ');
  }

  removeAt(arr, args) {
    var what,
      a = arguments,
      L = a.length,
      ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
  }

  updatePermissions() {
    this.loading = true;
    let body = {
      permissions: this.newPermissions,
    };
    this.auth.changeAdminPermissions(this.Admin.id, body).subscribe(
      (res: any) => {
        this.handleResponse(res.data);
      },
      (err) => {
        this.handleError(err);
      }
    );
  }

  handleResponse(data) {
    this.loading = false;
    this.modalTitle = 'Success';
    this.modalBody = data;
    this.getSingleUser(this.Admin.id);
    this.edit = false;
    this.openModal(this.content);
  }

  handleError(error) {
    this.loading = false;
    this.modalTitle = 'Error';
    this.modalBody = error.error.error;
    this.openModal(this.content);
  }
  openModal(content) {
    this.modal.open(content, { centered: true });
  }
}
