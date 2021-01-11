import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/auth/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NavService } from 'src/app/services/general/nav.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import Echo from 'laravel-echo';
import { environment } from 'src/environments/environment';

const PUSHER_API_KEY = environment.PUSHER_API_KEY;
const PUSHER_CLUSTER = environment.PUSHER_CLUSTER;

export interface User {
  avatar_image: string;
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  userable_type: string;
  total_tonnage: string;
  totalEarnings: string;
  totalWithdrawals: string;
  userable: {};
}

@Component({
  selector: 'app-collectors',
  templateUrl: './collectors.component.html',
  styleUrls: ['./collectors.component.css'],
})
export class CollectorsComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'name',
    'id',
    'last_login',
    'total_tonnage',
    'status',
    'toggle',
    'created_at',
    'menu',
  ];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<User>(true, []);

  constructor(
    private api: ApiService,
    private Auth: AuthService,
    private nav: NavService,
    private token: TokenService
  ) {}

  Users: any[] = [];
  Admins: any[] = [];
  task: any;
  subtask: any;
  allComplete: boolean = false;
  deleteLoading: boolean;
  currentPage = 1;
  collectionSize = 0;
  pageSize = 1;
  usersLoading: boolean = false;
  searchValue: any;
  timeOutId: any = 0;

  ngOnInit(): void {
    this.getUsers();
    this.subscribeToEcho();
  }

  subscribeToEcho() {
    let echo = new Echo({
      broadcaster: 'pusher',
      key: PUSHER_API_KEY,
      cluster: PUSHER_CLUSTER,
    });
    echo.channel('search-users').listen('.SEARCH_USERS', (e) => {
      this.handleResponse(e.users.original);
      this.usersLoading = false;
    });
  }

  getUsers(query?) {
    this.Auth.getAllUsers('collectors', query).subscribe(
      (res: any) => this.handleResponse(res),
      (error) => this.handleError(error)
    );
  }

  applyFilter(event: Event) {
    clearTimeout(this.timeOutId);
    if (this.searchValue) {
      this.timeOutId = setTimeout(() => {
        this.usersLoading = true;
        this.searchUsers(this.searchValue.trim());
      }, 700);
    } else {
      this.timeOutId = setTimeout(() => {
        this.usersLoading = true;
        this.getUsers();
      }, 700);
    }
  }

  searchUsers(query) {
    this.Auth.searchUsers('Collector', query).subscribe(
      (res) => {},
      (error) => {}
    );
  }

  handleResponse(res) {
    this.currentPage = res.current_page;
    this.collectionSize = res.total;
    this.pageSize = res.per_page;
    this.Users = res.data;
    this.dataSource = new MatTableDataSource(this.Users);
    this.dataSource.sort = this.sort;
    this.usersLoading = false;
  }

  handleError(error) {
    console.log(error.error.error);
    this.usersLoading = false;
  }

  gotoSingleUser(user) {
    this.nav.navigate('/dashboard/collector/ent_' + user.id, user);
  }

  gotoSingleAdmin(admin) {
    this.nav.navigate('/dashboard/users/Admin_' + admin.id, admin);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.Users.length > 0) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: User): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id + 1
    }`;
  }

  activateCollector(id) {
    this.deleteLoading = true;
    this.Auth.toggleCollectorStatus(id).subscribe(
      (res: any) => this.handleCollectorToggleResponse(res.data),
      (error) => this.handleCollectorToggleError(error)
    );
  }

  deactivateCollector(id) {
    this.deleteLoading = true;
    this.Auth.toggleCollectorStatus(id).subscribe(
      (res: any) => this.handleCollectorToggleResponse(res.data),
      (error) => this.handleCollectorToggleError(error)
    );
  }

  handleCollectorToggleResponse(data) {
    this.deleteLoading = false;
    this.getUsers();
    console.log(data);
  }

  handleCollectorToggleError(error) {
    this.deleteLoading = false;
  }

  deleteUser(id) {
    this.Auth.deleteUser('collectors', id).subscribe(
      (res: any) => this.handleDeleteResponse(res.data),
      (error) => this.handleDeleteError(error)
    );
  }

  handleDeleteResponse(data) {
    this.deleteLoading = false;
    this.getUsers();
    console.log(data);
  }

  handleDeleteError(error) {
    this.deleteLoading = false;
  }

  updateAllComplete() {
    this.allComplete = this.Users != null && this.Users.every((t) => t.checked);
  }

  someComplete(): boolean {
    return this.Users.filter((t) => t.checked).length > 0 && !this.allComplete;
  }

  setAll(checked: boolean) {
    this.allComplete = checked;
    if (this.Users == null) {
      return;
    }
    this.Users.forEach((t) => (t.checked = checked));
  }

  changePage() {
    let query = `&page=${this.currentPage}`;
    if (this.searchValue) {
      query = query + `&query=${this.searchValue.trim()}`;
      this.searchUsers(query);
    } else {
      this.getUsers(query);
    }
  }
}
